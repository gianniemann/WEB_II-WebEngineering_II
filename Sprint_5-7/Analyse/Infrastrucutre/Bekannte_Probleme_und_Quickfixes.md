# Bekannte Probleme & Quick-Fixes (Sprint 5–7 Infrastruktur)

Dieses Dokument sammelt typische Fehlerbilder, die beim **2. Setup-Durchlauf** fast immer auftreten,
inkl. schneller Diagnose und direkt anwendbarer Lösung.

## 1) Backend startet, aber Frontend meldet CORS-Fehler

**Typisches Symptom**
- Browser-Konsole: `CORS policy blocked ...`
- API-Aufruf aus der GUI scheitert, `curl` gegen Backend funktioniert aber.

**Ursache**
- `ALLOWED_ORIGIN` passt nicht zur tatsächlich genutzten Frontend-URL (`http://127.0.0.1:4173` vs `http://localhost:4173` etc.).

**Quick-Fix**
1. In `.env` exakt den Frontend-Origin setzen.
2. Backend neu starten.
3. In DevTools prüfen, ob `Access-Control-Allow-Origin` korrekt zurückkommt.

---

## 2) Schreibende Endpunkte liefern plötzlich 401/503

**Typisches Symptom**
- `POST/PUT/DELETE` funktionieren nicht, `GET` funktioniert.
- Antwort ist `401 Unauthorized` oder `503 API key protection is not configured`.

**Ursache**
- `x-api-key` im Frontend/Test fehlt oder stimmt nicht (`401`).
- `API_KEY` ist am Backend gar nicht gesetzt (`503`).

**Quick-Fix**
1. `API_KEY` in Backend-`.env` setzen.
2. Frontend-Feld „API Key“ bzw. Test-Env auf denselben Wert setzen.
3. Testen mit:
   - `curl -H "x-api-key: <KEY>" ...`

---

## 3) Backend läuft, DB-Verbindung schlägt trotzdem fehl

**Typisches Symptom**
- `/api/health` liefert 500 mit DB-Fehler.
- In Logs stehen `ECONNREFUSED`, `ER_ACCESS_DENIED_ERROR` oder `ER_BAD_DB_ERROR`.

**Ursache**
- Falsche DB-Zugangsdaten/DB-Name in `.env`.
- DB-Server lauscht nicht auf dem erwarteten Interface.
- Firewall-Regel zwischen Backend und DB fehlt.

**Quick-Fix**
1. `.env` prüfen: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
2. DB direkt testen: `mysql -h <DB_HOST> -P 3306 -u <DB_USER> -p`.
3. Firewall-Regel bestätigen: `ALLOW Backend_IP -> DB_IP:3306`.

---

## 4) DB ist aus Versehen extern erreichbar

**Typisches Symptom**
- Externer Test auf 3306 ist offen (`open`/`succeeded`).

**Ursache**
- Port-Forward in pfSense aktiv oder zu breite WAN-Regel.

**Quick-Fix**
1. WAN-Portforward auf `3306` entfernen.
2. Explizite Deny-Regel setzen: `Internet -> DB:3306 = DENY`.
3. Erneut extern testen: `nc -vz <ziel> 3306` muss fehlschlagen.

---

## 5) API ist erreichbar, aber nur lokal (nicht über 443)

**Typisches Symptom**
- `http://<backend-ip>:3000` intern geht.
- `https://<api-domain>/api/health` von außen geht nicht.

**Ursache**
- Reverse-Proxy/Gateway nicht korrekt geroutet.
- Zertifikat/Binding auf 443 unvollständig.

**Quick-Fix**
1. Proxy-Upstream auf Backend:3000 prüfen.
2. TLS-Zertifikat und Hostname-Binding prüfen.
3. Nur 443 öffentlich halten, 3000 extern sperren.

---

## 6) API-Tests schlagen „zufällig“ fehl

**Typisches Symptom**
- Smoke-Tests laufen lokal, aber gegen Live-URL inkonsistent.

**Ursache**
- Falsche `API_BASE_URL` / falscher `API_KEY` in Session.
- Testdatenzustand nicht eindeutig (alte Datensätze, Konflikte).

**Quick-Fix**
1. Vor Lauf prüfen:
   - `echo $API_BASE_URL`
   - `echo $API_KEY`
2. Test mit frischem Datensatz fahren (Script erzeugt/entfernt Transaktion).
3. Report immer schreiben: `REPORT_PATH=...` setzen.

---

## 7) Logs fehlen oder wachsen nicht

**Typisches Symptom**
- Keine neuen Einträge in `requests.log`/`errors.log`.

**Ursache**
- `LOG_DIR` zeigt auf falschen Pfad.
- Prozess hat keine Schreibrechte auf Log-Verzeichnis.

**Quick-Fix**
1. Effektiven Pfad prüfen (`LOG_DIR` in `.env`).
2. Verzeichnisrechte setzen (`chown/chmod`).
3. Testrequest ausführen und Datei-Zeitstempel prüfen.

---

## 8) Frontend zeigt alte Daten / falsches Backend

**Typisches Symptom**
- GUI scheint gegen altes Backend zu laufen.

**Ursache**
- Falsche API Base URL in der UI.
- Browser-Cache / Service Worker liefert alte Assets.

**Quick-Fix**
1. In der GUI API Base URL neu setzen und „übernehmen“.
2. Hard-Reload (Ctrl+F5) durchführen.
3. `/api/health` direkt aufrufen und Zielsystem verifizieren.

---

## Minimal-Checkliste nach jedem Neuaufbau

1. `GET /api/health` liefert `200`.
2. `POST /api/transactions` ohne Key liefert `401` oder `503` (je nach Konfig-Status).
3. `POST /api/transactions` mit Key liefert `201`.
4. Externer Test auf DB-Port `3306` schlägt fehl.
5. Request-Log enthält den letzten Test-Request.
