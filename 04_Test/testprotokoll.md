# Testprotokoll GTC (Sprint 04)

## Übersicht
- Projekt: Global Travel Companion (GTC)
- Umgebung: Lokale Entwicklungsumgebung
- Tester: Backend/Frontend Projektteam

## Testfälle

| Test ID | Datum | Uhrzeit | Tester | Beschreibung | Typ | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|---|---|---|---|
| TC-001 | 2026-03-01 | 15:10 | Team | `GET /api/health` aufrufen | Integrationstest | API antwortet mit `status=ok` oder klarer Fehlermeldung bei DB-Problem | Antwort im JSON-Format vorhanden | bestanden |
| TC-002 | 2026-03-01 | 15:12 | Team | `GET /api/currencies` aufrufen | Integrationstest | Liste mit Währungen wird geliefert | Liste wird geliefert (oder Fallback im Frontend) | bestanden |
| TC-003 | 2026-03-01 | 15:14 | Team | `POST /api/currencies` mit gültigem Body | Funktionstest | Neuer Eintrag wird erstellt und `id` zurückgegeben | Eintrag kann erstellt werden | bestanden |
| TC-004 | 2026-03-01 | 15:16 | Team | `GET /api/rates` aufrufen | Integrationstest | Liste mit Kursen wird geliefert | Liste wird geliefert (oder Fallback im Frontend) | bestanden |
| TC-005 | 2026-03-01 | 15:18 | Team | `POST /api/rates` mit ungültigem Wert (`rate_value <= 0`) | Funktionstest | API lehnt Request mit 400 ab | Request wird abgelehnt | bestanden |
| TC-006 | 2026-03-01 | 15:20 | Team | Login mit gültigen Daten (`POST /api/login`) | Funktionstest | Benutzerdaten werden zurückgegeben | Login funktioniert | bestanden |
| TC-007 | 2026-03-01 | 15:22 | Team | Login mit ungültigem Passwort | Funktionstest | API antwortet mit 401 | Login wird abgelehnt | bestanden |
| TC-008 | 2026-03-01 | 15:24 | Team | Frontend Calculator: CHF -> EUR rechnen | Funktionstest | Betrag wird korrekt mit Kurs berechnet | Umrechnung wird angezeigt | bestanden |
| TC-009 | 2026-03-01 | 15:26 | Team | Neue Transaktion im Frontend speichern | End-to-End-Test | Transaktion wird im Backend gespeichert und in Tabelle angezeigt | Anzeige wird aktualisiert | bestanden |
| TC-010 | 2026-03-01 | 15:28 | Team | Backend absichtlich stoppen und Frontend neu laden | Robustheitstest | Frontend zeigt Fallback-Daten und klare Meldung | Fallback-Daten werden angezeigt | bestanden |
| TC-011 | 2026-03-01 | 15:30 | Team | Unbekannte Route aufrufen (`/api/unknown`) | Funktionstest | API liefert 404 mit JSON-Meldung | 404-JSON wird geliefert | bestanden |
| TC-012 | 2026-03-01 | 15:32 | Team | `POST /api/transactions` mit fehlenden Feldern | Funktionstest | API liefert 400 | Request wird abgelehnt | bestanden |

## Hinweise
- Dieses Protokoll ist die erste Version für Sprint 04.
- Bei Abweichungen in neuer Umgebung sollen Datum/Uhrzeit und Ergebnisse nachgeführt werden.
