# Phase 1.2 yzx – Ubuntu-Backend-VM in VMware + pfSense-Grundaufbau

> Ziel dieser Phase: Eine Ubuntu-VM als Backend-Server einrichten und den Netzwerkpfad über pfSense sauber aufbauen.

---

## 0) Ergebnis dieser Phase

Am Ende läuft:

- Eine Ubuntu-VM in VMware.
- Node.js-Backend auf Ubuntu.
- Verbindung Ubuntu -> MySQL (Windows-Host) funktioniert.
- pfSense ist als zentrale Firewall/Router im Lab integriert.

---

## 1) Netzwerkplan (einfaches Lab-Design)

Für Anfänger ist ein klarer Plan extrem wichtig. Beispiel:

- **Windows Host** (MySQL): `192.168.10.10`
- **pfSense LAN**: `192.168.10.1`
- **Ubuntu VM (Backend)**: `192.168.10.20`
- **später Azure**: öffentlicher Zugriff nur auf Backend-Port

Hinweis:
- Nutze für alle internen Systeme ein privates Netz (z. B. `192.168.10.0/24`).

---

## 2) Ubuntu-VM in VMware erstellen

1. Ubuntu Server ISO herunterladen (LTS-Version).
2. In VMware „New Virtual Machine“ erstellen.
3. Empfohlene Startwerte:
   - 2 vCPU
   - 4 GB RAM
   - 40 GB Disk
4. Netzwerkadapter:
   - Erstmal in das gewünschte interne Lab-Netz hängen (z. B. Host-Only oder internes vSwitch-Konzept).
5. Ubuntu installieren:
   - Benutzer z. B. `admin`
   - SSH-Server mitinstallieren
6. Nach Installation einloggen.

---

## 3) Ubuntu-Basis absichern und aktualisieren

```bash
sudo apt update && sudo apt upgrade -y
sudo timedatectl set-timezone Europe/Berlin
```

Optional aber empfohlen:

```bash
sudo apt install -y ufw curl git
```

SSH prüfen:

```bash
ip a
sudo systemctl status ssh
```

---

## 4) Node.js (LTS) installieren

Ein sauberer Weg über NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 5) Projekt auf Ubuntu bereitstellen

1. Repository klonen (oder ZIP übertragen).
2. In den Backend-Ordner wechseln:

```bash
cd Abgabe/backend
npm ci
```

Wenn `npm ci` scheitert (z. B. lockfile fehlt), alternativ:

```bash
npm install
```

---

## 6) `.env` für Backend korrekt setzen

1. `.env.example` nach `.env` kopieren.
2. Werte setzen, z. B.:

```env
PORT=3000
DB_HOST=192.168.10.10
DB_PORT=3306
DB_USER=webapp_user
DB_PASSWORD=SEHR_STARKES_PASSWORT
DB_NAME=webapp_prod
ALLOWED_ORIGIN=https://dein-frontend.example
API_KEY=DEIN_API_KEY
```

Wichtig:
- `DB_HOST` ist die **Windows-IP mit MySQL**, nicht `localhost`.

---

## 7) Verbindung zur Datenbank testen

Auf Ubuntu:

```bash
sudo apt install -y mysql-client
mysql -h 192.168.10.10 -P 3306 -u webapp_user -p webapp_prod
```

Dann in MySQL:

```sql
SHOW TABLES;
```

Wenn das klappt, ist die Netzwerkstrecke Ubuntu -> MySQL bereit.

---

## 8) Backend als Service starten (systemd)

Service-Datei anlegen:

```bash
sudo nano /etc/systemd/system/webapp-backend.service
```

Inhalt (Pfade anpassen):

```ini
[Unit]
Description=WebApp Backend
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/Abgabe/backend
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Aktivieren:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now webapp-backend
sudo systemctl status webapp-backend
```

Health prüfen:

```bash
curl http://127.0.0.1:3000/api/health
```

---

## 9) Ubuntu-Firewall (UFW) setzen

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow from <AZURE_ODER_FRONTEND_IP> to any port 3000 proto tcp
sudo ufw enable
sudo ufw status verbose
```

Wenn Azure-IP noch nicht fix ist, zunächst im Lab-Netz testen und später nachziehen.

---

## 10) pfSense minimal integrieren

PfSense soll den Verkehr sichtbar/regulierbar machen.

1. pfSense-VM in VMware erstellen.
2. Zwei Interfaces:
   - WAN (Richtung Internet/Upstream)
   - LAN (dein internes Lab-Netz)
3. LAN-IP setzen, z. B. `192.168.10.1/24`.
4. DHCP optional auf pfSense aktivieren (oder statische IPs vergeben).
5. Firewall-Regeln im LAN:
   - Erlaube Ubuntu -> MySQL: TCP 3306 zu `192.168.10.10`
   - Erlaube Frontend/Azure -> Ubuntu: TCP 3000 zu `192.168.10.20`
   - Blockiere unnötige Any-Any-Regeln
6. Logs prüfen (`Status -> System Logs -> Firewall`).

---

## 11) Schneller Endtest in Phase 1.2

- Von Ubuntu: DB erreichbar? ✅
- Backend läuft als Service? ✅
- `GET /api/health` lokal okay? ✅
- pfSense-Regeln greifen? ✅

---

## Exit-Kriterien Phase 1.2

- Ubuntu-Backend ist stabil in VMware installiert.
- Backend kann auf MySQL zugreifen.
- Basis-Firewall ist aktiv (Ubuntu + pfSense).
- Die Kernpfade (3000/3306) sind dokumentiert und nachvollziehbar.
