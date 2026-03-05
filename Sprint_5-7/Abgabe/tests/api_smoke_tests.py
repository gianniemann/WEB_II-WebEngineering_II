#!/usr/bin/env python3
"""Einfache API-Smoke-Tests für Sprint 5–7.

Verwendung:
  API_BASE_URL=http://127.0.0.1:3000/api API_KEY=xyz python Sprint_5-7/Abgabe/tests/api_smoke_tests.py
"""

import json
import os
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("API_BASE_URL", "http://127.0.0.1:3000/api").rstrip("/")
API_KEY = os.environ.get("API_KEY", "")


def request(method, path, payload=None, auth=False):
    data = None
    headers = {"Content-Type": "application/json"}
    if auth and API_KEY:
        headers["x-api-key"] = API_KEY
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(f"{BASE}{path}", method=method, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else None
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8")
        parsed = json.loads(body) if body else None
        return err.code, parsed


def assert_status(actual, expected, message):
    if actual != expected:
        raise AssertionError(f"{message}: expected {expected}, got {actual}")


def main():
    s, body = request("GET", "/health")
    assert_status(s, 200, "Health endpoint")
    assert body and body.get("status") == "ok"

    s, body = request("GET", "/transactions")
    assert_status(s, 200, "List transactions")
    assert isinstance(body, list)

    s, _ = request("POST", "/transactions", {
        "transaction_date": "2026-01-01 10:00:00",
        "user_login": "max",
        "source_amount": 10,
        "source_currency": "CHF",
        "target_currency": "EUR",
        "exchange_rate": 1.03,
    }, auth=False)
    if API_KEY:
        assert_status(s, 401, "Create transaction without API key")

    s, body = request("POST", "/transactions", {
        "transaction_date": "2026-01-01 10:00:00",
        "user_login": "max",
        "source_amount": 10,
        "source_currency": "CHF",
        "target_currency": "EUR",
        "exchange_rate": 1.03,
    }, auth=True)
    if API_KEY:
        assert_status(s, 201, "Create transaction with API key")
        tx_id = body["id"]

        s, _ = request("POST", f"/transactions/{tx_id}/status", {"status": "approved"}, auth=True)
        assert_status(s, 200, "Set approved status")

        s, _ = request("DELETE", f"/transactions/{tx_id}", auth=True)
        assert_status(s, 204, "Delete transaction")

    print("All configured smoke tests passed.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"TEST FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
