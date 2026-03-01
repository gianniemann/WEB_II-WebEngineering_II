# Global Travel Companion (GTC)

Dieses Repository enthält den aktuellen Stand für Sprint 01 bis 04.
Die Umsetzung ist bewusst einfach gehalten (Demo-Stil, kein High-End-Stack).

## Projektstruktur
- `03_Sprint_Umsetzung/` Frontend (einfaches HTML + Vanilla JavaScript)
- `backend/` REST Backend (Node.js + Express + MySQL)
- `backend/sql/init.sql` SQL-Skript für DB-Initialisierung
- `04_Test/testprotokoll.md` Testprotokoll Sprint 04
- `aktueller_stand/` laufende Status- und Analyse-Dokumente

## Voraussetzungen
- Node.js 18+ (oder kompatibel)
- npm
- MySQL 8+
- Browser für Frontend

## Datenbank aufsetzen
1. MySQL starten
2. SQL-Skript ausführen:

```bash
cd backend
mysql -u root -p < sql/init.sql
```

## Backend starten

```bash
cd backend
npm install
npm start
```

Standardwerte:
- `PORT=3000`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=` (leer)
- `DB_NAME=gtc`

## Frontend starten

```bash
# im Repo-Root
python -m http.server 8000
```

Danach im Browser öffnen:
- `http://127.0.0.1:8000/03_Sprint_Umsetzung/index.html`

## Bekannte Demo-Logins
- `max / max123`
- `anna / anna123`

## API (Kurzüberblick)
- `GET /api/health`
- `GET /api/currencies`
- `POST /api/currencies`
- `GET /api/rates`
- `POST /api/rates`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/users`
- `POST /api/users`
- `POST /api/login`

## Schritt-für-Schritt Anleitung
- Siehe `ANLEITUNG_SCHRITT_FUER_SCHRITT.md`

## Hinweis
Diese Fassung ist auf Verständlichkeit und Nachvollziehbarkeit ausgerichtet.
