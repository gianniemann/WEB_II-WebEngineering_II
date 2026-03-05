#!/usr/bin/env python3
"""API-Smoke-Tests für Sprint 5–7 (Live- oder lokale Umgebung).

Verwendung:
  API_BASE_URL=http://127.0.0.1:3000/api API_KEY=xyz python Sprint_5-7/Abgabe/tests/api_smoke_tests.py
Optional:
  REPORT_PATH=Sprint_5-7/Abgabe/artefakte/tests/api_smoke_report.json
"""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

BASE = os.environ.get("API_BASE_URL", "http://127.0.0.1:3000/api").rstrip("/")
API_KEY = os.environ.get("API_KEY", "")
INVALID_API_KEY = os.environ.get("INVALID_API_KEY", "invalid-key")
REPORT_PATH = os.environ.get("REPORT_PATH", "").strip()


def request(method, path, payload=None, api_key=None):
    data = None
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["x-api-key"] = api_key
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
    expected_values = expected if isinstance(expected, (tuple, list, set)) else [expected]
    if actual not in expected_values:
        raise AssertionError(f"{message}: expected {expected_values}, got {actual}")


def run_test(results, name, fn):
    try:
        fn()
        results.append({"name": name, "status": "passed"})
    except Exception as exc:  # noqa: BLE001 - CLI test runner should catch all and report once
        results.append({"name": name, "status": "failed", "error": str(exc)})
        raise


def main():
    results = []
    created_tx_id = None

    def test_health():
        s, body = request("GET", "/health")
        assert_status(s, 200, "Health endpoint")
        assert body and body.get("status") == "ok", "Health payload invalid"

    def test_list_transactions():
        s, body = request("GET", "/transactions")
        assert_status(s, 200, "List transactions")
        assert isinstance(body, list), "Transactions response is not a list"

    def test_create_without_or_invalid_key_rejected():
        payload = {
            "transaction_date": "2026-01-01 10:00:00",
            "user_login": "max",
            "source_amount": 10,
            "source_currency": "CHF",
            "target_currency": "EUR",
            "exchange_rate": 1.03,
        }
        s, _ = request("POST", "/transactions", payload, api_key=INVALID_API_KEY)
        assert_status(s, (401, 403), "Create transaction with invalid API key should be rejected")

    def test_create_with_valid_key():
        nonlocal created_tx_id
        if not API_KEY:
            raise AssertionError("API_KEY fehlt: geschützte Endpunkte können nicht getestet werden.")

        payload = {
            "transaction_date": "2026-01-01 10:00:00",
            "user_login": "max",
            "source_amount": 10,
            "source_currency": "CHF",
            "target_currency": "EUR",
            "exchange_rate": 1.03,
        }
        s, body = request("POST", "/transactions", payload, api_key=API_KEY)
        assert_status(s, 201, "Create transaction with valid API key")
        assert body and "id" in body, "Create transaction response misses id"
        created_tx_id = body["id"]

    def test_domain_rule_cancelled_lock():
        if not created_tx_id:
            raise AssertionError("Keine Testtransaktion vorhanden.")

        s, _ = request("POST", f"/transactions/{created_tx_id}/status", {"status": "cancelled"}, api_key=API_KEY)
        assert_status(s, 200, "Set cancelled status")

        s, _ = request("POST", f"/transactions/{created_tx_id}/status", {"status": "approved"}, api_key=API_KEY)
        assert_status(s, 409, "Cancelled transaction must not transition to approved")

    def cleanup_transaction():
        if created_tx_id and API_KEY:
            request("DELETE", f"/transactions/{created_tx_id}", api_key=API_KEY)

    try:
        run_test(results, "health endpoint", test_health)
        run_test(results, "list transactions", test_list_transactions)
        run_test(results, "invalid api key rejected", test_create_without_or_invalid_key_rejected)
        run_test(results, "create transaction with api key", test_create_with_valid_key)
        run_test(results, "domain rule cancelled lock", test_domain_rule_cancelled_lock)
    finally:
        cleanup_transaction()

    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "base_url": BASE,
        "results": results,
        "passed": sum(1 for r in results if r["status"] == "passed"),
        "failed": sum(1 for r in results if r["status"] == "failed"),
    }

    if REPORT_PATH:
        os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
        with open(REPORT_PATH, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

    print(json.dumps(report, indent=2))
    print("All configured smoke tests passed.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"TEST FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
