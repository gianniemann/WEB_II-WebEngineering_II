# Testprotokoll Sprint 04 – Global Travel Companion (GTC)

- **Projekt:** Global Travel Companion (GTC)
- **Sprint:** 04
- **Tester:** Matthias Oberholzer
- **Testumgebung:**
  - Backend: Node.js (Express) auf `http://127.0.0.1:3000`
  - Frontend: Statischer Server auf `http://127.0.0.1:4173`
  - Datenbank: MySQL 8.x, Schema aus `backend/sql/init.sql`

## Testfälle

| Test-ID | Datum / Uhrzeit | Name des Testers | Beschreibung des Tests | Typ des Tests | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|---|---|---|
| TC-04-001 | 2026-01-15 09:05 | Matthias Oberholzer | Aufruf von `GET /api/health` zur Verfügbarkeitsprüfung des Backends. | Funktionstest | API liefert HTTP 200 und JSON mit Statusmeldung. | HTTP 200 erhalten, JSON mit gesundem Status wurde zurückgegeben. | bestanden |
| TC-04-002 | 2026-01-15 09:10 | Matthias Oberholzer | Laden der Seite im Browser und Sichtprüfung der Hauptbereiche (Status, Currencies, Rates, Calculator, Login). | Integrationstest | Alle UI-Sektionen werden ohne Rendering-Fehler angezeigt. | Alle Bereiche sichtbar und ohne JavaScript-Fehler in der Konsole. | bestanden |
| TC-04-003 | 2026-01-15 09:18 | Matthias Oberholzer | Abruf von Währungen über `GET /api/currencies`. | Funktionstest | Liste mit mindestens den initialen Standardwährungen wird geliefert. | Endpunkt liefert Datenliste im erwarteten JSON-Format. | bestanden |
| TC-04-004 | 2026-01-15 09:25 | Matthias Oberholzer | Anlegen einer neuen Währung per `POST /api/currencies`. | Funktionstest | Währung wird erstellt und kann danach erneut ausgelesen werden. | Datensatz wurde erstellt; Folgerequest enthält neue Währung. | bestanden |
| TC-04-005 | 2026-01-15 09:33 | Matthias Oberholzer | Abruf von Wechselkursen über `GET /api/rates`. | Funktionstest | API liefert Liste von Kursen mit Quelle/Ziel und Wert. | Kursdaten wurden erfolgreich geladen. | bestanden |
| TC-04-006 | 2026-01-15 09:42 | Matthias Oberholzer | Rechnerfunktion im Frontend: Betrag und Währungspaare eingeben, Umrechnung starten. | Integrationstest | Umgerechneter Wert wird korrekt angezeigt. | Ergebnis wurde berechnet und im UI korrekt dargestellt. | bestanden |
| TC-04-007 | 2026-01-15 09:50 | Matthias Oberholzer | Login mit gültigen Zugangsdaten (`max / max123`). | Funktionstest | Erfolgreiche Anmeldung mit positiver Rückmeldung. | Login erfolgreich, Rückmeldung im Frontend sichtbar. | bestanden |
| TC-04-008 | 2026-01-15 09:55 | Matthias Oberholzer | Login mit ungültigem Passwort. | Negativtest | Anmeldung wird abgelehnt und Fehlermeldung angezeigt. | Login abgelehnt, nutzerfreundliche Fehlermeldung wurde angezeigt. | bestanden |
| TC-04-009 | 2026-01-15 10:03 | Matthias Oberholzer | Erstellen einer neuen Transaktion über `POST /api/transactions`. | Integrationstest | Transaktion wird persistent gespeichert und bestätigt. | Transaktion wurde gespeichert und mit Erfolg quittiert. | bestanden |
| TC-04-010 | 2026-01-15 10:11 | Matthias Oberholzer | Abruf der Transaktionsliste über `GET /api/transactions` nach dem Erstellen eines Eintrags. | Integrationstest | Neu erstellte Transaktion erscheint in der Liste. | Eintrag ist in der Liste vorhanden. | bestanden |
| TC-04-011 | 2026-01-15 10:20 | Matthias Oberholzer | Lasttest mit 50 parallelen `GET /api/health`-Requests (lokal). | Lasttest | Keine Serverabstürze, Antwortzeit bleibt stabil, alle Requests beantworten erfolgreich. | 49/50 Requests erfolgreich; 1 Timeout bei >2 s. | fehlgeschlagen |
| TC-04-012 | 2026-01-15 10:35 | Matthias Oberholzer | Test der Fallback-Daten im Frontend bei gestopptem Backend. | Integrationstest | Frontend zeigt definierte Fallback-Werte für Currencies/Rates an. | Test wegen Zeitmangel in dieser Session nicht durchgeführt. | nicht durchgeführt |

## Kurzfazit

- Kernfunktionen (Health, Currencies, Rates, Login, Transactions) wurden erfolgreich getestet.
- Ein Lasttest zeigte Optimierungspotenzial bei gleichzeitigen Requests.
- Ein geplanter Fallback-Test ist noch ausstehend.
