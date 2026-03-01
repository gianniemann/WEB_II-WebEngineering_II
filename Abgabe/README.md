# Abgabe – Global Travel Companion

Dieser Ordner enthält alles, was für die Abgabe erforderlich ist:

- `backend/` – Node.js + Express + SQLite API
- `frontend/` – HTML/CSS/JS Oberfläche

## 1) Voraussetzungen

Bitte installiere folgende Tools:

- **Node.js** (empfohlen: aktuelle LTS-Version)
- **npm** (ist mit Node.js dabei)

## 2) Backend starten

1. Terminal öffnen.
2. In den Backend-Ordner wechseln:

   ```bash
   cd backend
   ```

3. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

4. Server starten:

   ```bash
   npm start
   ```

5. Kontrolle im Browser (optional):

   ```
   http://127.0.0.1:3000/api/status
   ```

   Wenn alles läuft, sollte ein JSON-Status angezeigt werden.

## 3) Frontend starten

Das Frontend ist statisch und kann z. B. über einen einfachen lokalen Server ausgeliefert werden.

### Variante A: mit Python (einfach)

1. Neues Terminal öffnen.
2. In den Frontend-Ordner wechseln:

   ```bash
   cd frontend
   ```

3. Server starten:

   ```bash
   python3 -m http.server 4173
   ```

4. Im Browser öffnen:

   ```
   http://127.0.0.1:4173
   ```

### Variante B: Live Server (VS Code)

- `frontend/index.html` mit einer Live-Server-Erweiterung starten.

## 4) Anwendung testen

- Backend muss auf `http://127.0.0.1:3000` laufen.
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
