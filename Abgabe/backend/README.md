# GTC Backend

Node.js + Express + MySQL API für Sprint 5–7.

## Start

```bash
cd backend
cp .env.example .env
npm install
npm start
```

## Umgebungsvariablen

- `PORT` (default: `3000`)
- `ALLOWED_ORIGIN` (default: `*`)
- `API_KEY` (**verpflichtend**: schreibende Endpunkte antworten sonst mit `503`)
- `LOG_DIR` (default: `../logs`)
- `DB_HOST` (default: `127.0.0.1`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: leer)
- `DB_NAME` (default: `gtc`)

## Datenbank initialisieren

```bash
mysql -u root -p < sql/init.sql
```

## Endpunkte (Auszug)

### Health
- `GET /api/health`
- `GET /api/status`

### Transactions
- `GET /api/transactions`
- `GET /api/transactions/:id`
- `POST /api/transactions` (API-Key)
- `PUT /api/transactions/:id` (API-Key)
- `DELETE /api/transactions/:id` (API-Key)
- `POST /api/transactions/:id/status` (API-Key, Spezialfall)

### Weitere
- `GET/POST /api/currencies` (`POST` mit API-Key)
- `GET/POST /api/rates` (`POST` mit API-Key)
- `GET/POST /api/users` (`POST` mit API-Key)
- `POST /api/login`

## Logging

- Request-Logs: `${LOG_DIR}/requests.log`
- Error-Logs: `${LOG_DIR}/errors.log`
