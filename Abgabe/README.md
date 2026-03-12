# Abgabe – Global Travel Companion

Dieser Ordner enthält alles, was für die Abgabe erforderlich ist:

- `backend/` – Node.js + Express + MySQL API
- `frontend/` – HTML/CSS/JS Oberfläche

## 1) Voraussetzungen

Bitte installiere folgende Tools:

- **Node.js** (empfohlen: aktuelle LTS-Version)
- **npm** (ist mit Node.js dabei)
- **Python 3** oder ein anderer statischer Webserver
- **MySQL**

## 2) Backend konfigurieren und starten

1. In `Abgabe/backend` wechseln.
2. `.env.example` kopieren und anpassen:

   ```bash
   cp .env.example .env
   ```

3. Abhängigkeiten installieren und Server starten:

   ```bash
   npm install
   npm start
   ```

Wichtige Variablen in `.env`:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `API_KEY` (**Pflicht** für geschützte Schreib-Endpunkte; ohne Wert liefern diese `503`)
- `ALLOWED_ORIGIN`

Kontrolle im Browser:

```text
http://127.0.0.1:3000/api/health
```

## 3) Datenbank initialisieren

SQL-Datei ausführen:

```bash
mysql -u root -p < sql/init.sql
```

Die Datei erzeugt das Schema inkl. Foreign Keys und Seed-Daten.

## 4) Frontend starten

### Variante A: aus `Abgabe/`

```bash
npm run start:frontend
```

Dann im Browser öffnen:

```text
http://127.0.0.1:4173
```

### Variante B: direkt im `frontend/`-Ordner

```bash
cd frontend
npm start
```

## 5) GUI/API Funktionstest

Die Oberfläche unterstützt für `transactions`:
- CREATE (`POST /api/transactions`)
- READ (`GET /api/transactions`)
- UPDATE (`PUT /api/transactions/{id}`)
- DELETE (`DELETE /api/transactions/{id}`)
- Spezialfall (`POST /api/transactions/{id}/status`)

Im Abschnitt **API Konfiguration** im Frontend können `API Base URL` und `API Key` gesetzt werden.

## 6) Testprotokoll Sprint 04

- Das geforderte Testprotokoll mit mindestens zehn Testfällen befindet sich in `Abgabe/testprotokoll_sprint04.md`.
