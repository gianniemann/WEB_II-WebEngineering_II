# Abgabe – Global Travel Companion

Dieser Ordner enthält alles, was für die Abgabe erforderlich ist:

- `backend/` – Node.js + Express + MySQL API
- `frontend/` – HTML/CSS/JS Oberfläche

## 1) Voraussetzungen

Bitte installiere folgende Tools:

- **Node.js** (empfohlen: aktuelle LTS-Version)
- **npm** (ist mit Node.js dabei)
- **Python 3** (für den statischen Frontend-Server)

## 2) Backend starten

### Empfohlener Weg aus dem `Abgabe/`-Ordner

1. Terminal öffnen.
2. In den Abgabe-Ordner wechseln.
3. Backend-Abhängigkeiten installieren:

   ```bash
   npm run install:backend
   ```

4. Backend starten:

   ```bash
   npm start
   ```

### Alternativ direkt im `backend/`-Ordner

```bash
cd backend
npm install
npm start
```

Kontrolle im Browser (optional):

```
http://127.0.0.1:3000/api/health
```

Wenn alles läuft, sollte ein JSON-Status angezeigt werden.

Hinweis: Aus Kompatibilitätsgründen funktioniert auch `http://127.0.0.1:3000/api/status`.

## 3) Frontend starten

### Variante A: aus `Abgabe/`

```bash
npm run start:frontend
```

Danach im Browser öffnen:

```
http://127.0.0.1:4173
```

### Variante B: direkt im `frontend/`-Ordner mit npm

```bash
cd frontend
npm start
```

### Variante C: Live Server (VS Code)

- `frontend/index.html` mit einer Live-Server-Erweiterung starten.

## 4) Anwendung testen

- Backend muss auf `http://127.0.0.1:3000` laufen.
- Zusätzlich muss MySQL laufen und die Datenbank `gtc` mit `Abgabe/backend/sql/init.sql` initialisiert sein.
- Danach Frontend öffnen.
- Folgende Bereiche prüfen:
  - Status
  - Currencies
  - Rates
  - Calculator
  - Login
  - Neue Transaktion
  - Transactions

## 5) Hinweise

- Die Frontend-API-Basis ist in `frontend/scripts/main.js` als
  `http://127.0.0.1:3000/api` hinterlegt.
- Falls das Backend nicht erreichbar ist, zeigt das Frontend Fallback-Daten für Currencies/Rates.
- Falls du im `frontend/`-Ordner die API starten willst, nutze:

  ```bash
  npm run start:api
  ```

  Dieser Script startet explizit das Backend aus `../backend` (also aus `Abgabe/backend`).
