# Schritt-für-Schritt Anleitung: GTC lokal starten

## 1) Welche Tools du brauchst

## Tool 1: Git
**Wofür?**
- Damit du das Projekt auf deinen Computer holen kannst.

**Wie installieren?**
- Windows: Git for Windows installieren
- macOS: `brew install git` (oder Xcode Command Line Tools)
- Linux (Ubuntu/Debian): `sudo apt install git`

**Testen ob es läuft:**
```bash
git --version
```

## Tool 2: Node.js + npm
**Wofür?**
- Für das Backend (`Express` Server).
- `npm` installiert die Backend-Abhängigkeiten.

**Wie installieren?**
- Von nodejs.org (LTS Version) installieren.

**Testen ob es läuft:**
```bash
node -v
npm -v
```

## Tool 3: MySQL
**Wofür?**
- Das Backend speichert Daten in MySQL (`gtc` Datenbank).

**Wie installieren?**
- MySQL Community Server installieren.
- Während der Installation Root-Passwort setzen.

**Testen ob es läuft:**
```bash
mysql --version
```

## Tool 4: Python (oder Alternative für Static Server)
**Wofür?**
- Um das Frontend lokal als statische Webseite zu starten.

**Testen ob es läuft:**
```bash
python --version
```

---

## 2) Projekt auf deinen Computer holen

```bash
cd WEB_II-WebEngineering_II
```

---

## 3) Datenbank vorbereiten (MySQL)

### Schritt 3.1: MySQL starten
- Stelle sicher, dass dein MySQL-Dienst läuft.

### Schritt 3.2: SQL-Skript ausführen
Im Projektordner:

```bash
cd backend
mysql -u root -p < sql/init.sql
```

Dann Passwort eingeben.

**Was passiert hier?**
- Datenbank `gtc` wird erstellt.
- Tabellen werden erstellt (`currency`, `rate`, `transaction`, `user`).
- Demo-Daten werden eingefügt.

---

## 4) Backend starten

Im Ordner `backend`:

```bash
npm install
npm start
```

Wenn alles gut ist, siehst du eine Meldung wie:
- `GTC backend running on port 3000`

### Optional: eigene DB-Einstellungen setzen
Falls dein MySQL nicht mit den Defaults läuft, setze Variablen vor dem Start:

- `DB_HOST` (Standard `127.0.0.1`)
- `DB_PORT` (Standard `3306`)
- `DB_USER` (Standard `root`)
- `DB_PASSWORD` (Standard leer)
- `DB_NAME` (Standard `gtc`)
- `PORT` (Standard `3000`)

---

## 5) Frontend starten

Zurück in den Projekt-Root:

```bash
cd ..
python -m http.server 8000
```

Dann im Browser öffnen:

```text
http://127.0.0.1:8000/03_Sprint_Umsetzung/index.html
```

---

## 6) Schnelltest ob alles läuft

## API Test
Im Browser aufrufen:

```text
http://127.0.0.1:3000/api/health
```

Erwartet: JSON-Antwort mit Status.

## Frontend Test
- Seite öffnen
- Currencies/Rates sollten geladen werden
- Login testen mit:
  - `max / max123`
  - `anna / anna123`
- Calculator testen
- Transaktion speichern

---

## 7) Häufige Probleme

## Problem: `ECONNREFUSED` / Backend nicht erreichbar
- Prüfen ob `npm start` läuft.
- Port 3000 frei?
- DB_PASSWORD korrekt in der Datei '\backend\src\db.js' gesetzt?

## Problem: DB Fehler beim Backend-Start
- Läuft MySQL?
- Wurde `sql/init.sql` wirklich ausgeführt?
- Stimmen `DB_*` Variablen?

## Problem: Frontend zeigt Fallback-Daten
- Bedeutet meist: Backend nicht erreichbar oder API-Fehler.
- Backend-Konsole prüfen.

---

## 8) Reihenfolge (kurz und knapp)
1. Tools installieren (Git, Node, MySQL, Python)
2. Repo klonen
3. `cd backend`
4. `mysql -u root -p < sql/init.sql`
5. `npm install`
6. `npm start`
7. Neues Terminal -> ins Projekt-Root
8. `python -m http.server 8000`
9. Browser öffnen: `http://127.0.0.1:8000/03_Sprint_Umsetzung/index.html`
