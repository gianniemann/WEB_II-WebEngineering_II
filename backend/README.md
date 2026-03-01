# GTC Backend (Sprint 03 Start)

Einfaches Backend-Grundgerüst gemäss Sprint 03:
- Node.js + Express.js
- MySQL
- REST-API für currencies, rates, transactions, users/login

## Start

```bash
cd backend
npm install
npm start
```

## Umgebungsvariablen (optional)

- `PORT` (default: `3000`)
- `DB_HOST` (default: `127.0.0.1`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: leer)
- `DB_NAME` (default: `gtc`)

## Datenbank initialisieren

SQL-Datei ausführen:

```bash
mysql -u root -p < sql/init.sql
```

## Endpunkte

### Health
- `GET /api/health`

### Currencies
- `GET /api/currencies`
- `POST /api/currencies`

Body Beispiel:
```json
{
  "iso_code": "CHF",
  "name": "Swiss Franc",
  "countries": "Switzerland, Liechtenstein"
}
```

### Rates
- `GET /api/rates`
- `POST /api/rates`

Body Beispiel:
```json
{
  "base_currency": "CHF",
  "target_currency": "EUR",
  "rate_value": 1.03,
  "rate_date": "2026-02-01 10:00:00"
}
```

### Transactions
- `GET /api/transactions`
- `POST /api/transactions`

Body Beispiel:
```json
{
  "transaction_date": "2026-02-01 10:10:00",
  "user_login": "max",
  "source_amount": 100,
  "source_currency": "CHF",
  "target_currency": "EUR",
  "exchange_rate": 1.03
}
```

### Users / Login
- `GET /api/users`
- `POST /api/users`
- `POST /api/login`
