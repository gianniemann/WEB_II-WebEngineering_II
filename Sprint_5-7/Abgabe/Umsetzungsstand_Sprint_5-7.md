# Sprint 5–7 – Umsetzungsstand (technischer Fortschritt)

## Erledigt im Repository

### Backend / API
- API-Key-Absicherung für schreibende Endpunkte (`POST`, `PUT`, `DELETE`) ergänzt.
- Request-Logging und Error-Logging eingeführt (Dateien: `logs/requests.log`, `logs/errors.log`).
- `transactions` um vollständige CRUD-Funktionalität erweitert (`GET by id`, `PUT`, `DELETE`).
- Spezialfall-Endpunkt `POST /api/transactions/{id}/status` implementiert.
- Business-Regel umgesetzt: Transaktionen mit Status `cancelled` dürfen nicht mehr in einen anderen Status wechseln.

### Sicherheit / Konfiguration
- Harte DB-Passwörter aus Code entfernt.
- `.env.example` für reproduzierbare, sichere Konfiguration ergänzt.
- CORS über `ALLOWED_ORIGIN` steuerbar gemacht.

### Datenbank
- SQL-Schema auf relationale Struktur mit Foreign Keys angehoben:
  - `rate.base_currency` → `currency.iso_code`
  - `rate.target_currency` → `currency.iso_code`
  - `transaction.user_login` → `user.login`
  - `transaction.source_currency` → `currency.iso_code`
  - `transaction.target_currency` → `currency.iso_code`
- `transaction.status` ergänzt (`pending`, `approved`, `cancelled`).
- Seed-Daten für alle Tabellen ergänzt.

## Noch offen / Nächste sinnvolle Schritte
1. Plattform-Deployment effektiv auf drei Infrastrukturen durchführen (Azure, Ubuntu VM, Local DB).
2. Firewall-/pfSense-Regeln produktiv setzen und mit externen Zugriffstests dokumentieren.
3. Mindestens fünf API-Tests gegen die echte verteilte Umgebung ausführen und Resultate als Artefakte ablegen.
4. GUI auf neue Endpunkte (Statuswechsel, Update/Delete-Flow) erweitern.
