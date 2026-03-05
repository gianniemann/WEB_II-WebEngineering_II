# Phase 1.3 zxy – Azure-Umgebung anbinden (Frontend + sichere Erreichbarkeit)

> Ziel dieser Phase: Azure als „öffentliche Schicht“ nutzen und dein lokales/VMware-Lab kontrolliert anbinden.

---

## 0) Ergebnis dieser Phase

Am Ende hast du:

- Eine Azure-Ressourcengruppe.
- Ein Frontend-Hosting in Azure (z. B. Static Web App oder VM/Nginx).
- Eine sichere Verbindung zum Backend in Ubuntu.
- Funktionierende End-to-End-Tests (Browser -> API -> MySQL).

---

## 1) Vorentscheidung: Wie soll Azure genutzt werden?

Für dein aktuelles Setup gibt es zwei praktikable Varianten:

### Variante A (einfach): Nur Frontend in Azure
- Azure hostet nur die statische Oberfläche.
- Backend bleibt in Ubuntu-VM lokal.
- Nachteil: Lokales Backend muss aus dem Internet erreichbar sein (Portfreigabe/DDNS/Reverse Proxy nötig).

### Variante B (stabiler): Frontend + Backend in Azure
- Azure hostet Frontend.
- Azure hostet zusätzlich Backend-VM oder App Service.
- MySQL bleibt lokal oder wandert später ebenfalls in Azure.

Für Anfänger ist Variante A oft schneller startbar, Variante B ist langfristig meist sauberer.

---

## 2) Azure Grundaufbau

1. In Azure Portal anmelden.
2. Neue **Resource Group** anlegen, z. B. `rg-webii-prod`.
3. Region wählen (z. B. `West Europe`).
4. Kostenkontrolle aktivieren:
   - Budget erstellen
   - Kostenwarnung ab bestimmtem Betrag

---

## 3) Frontend in Azure bereitstellen

### Option 1: Azure Static Web Apps (empfohlen für statisches Frontend)

1. „Create Resource“ -> „Static Web App“.
2. Repository verbinden (GitHub/Azure DevOps).
3. Build-Pfad setzen (abhängig von deinem Frontend-Projekt).
4. Deployment abwarten.
5. Öffentliche URL notieren, z. B. `https://nice-app.azurestaticapps.net`.

### Option 2: VM + Nginx

1. Linux VM erstellen.
2. Nginx installieren.
3. Build-Artefakte (`dist`/`build`) nach `/var/www/html` kopieren.
4. NSG nur für 80/443 öffnen.

---

## 4) Backend von Azure aus erreichbar machen

Wenn Backend lokal bleibt (Variante A), brauchst du eine kontrollierte Veröffentlichung:

Mindestanforderungen:
- TLS/HTTPS (z. B. Reverse Proxy mit Zertifikat)
- Feste DNS-Adresse (z. B. DDNS)
- Port 3000 nicht „roh“ ohne Schutz direkt ins Internet

Empfehlung:
- Nginx/Caddy als Reverse Proxy vor Backend
- Nur `/api/*` nach intern `192.168.10.20:3000` weiterleiten
- API-Key-Prüfung im Backend aktiv lassen

Dann im Frontend konfigurieren:

```env
API_BASE_URL=https://api.deinprojekt.de
```

---

## 5) CORS und API-Key sauber setzen

Im Backend `.env` prüfen:

- `ALLOWED_ORIGIN=https://<deine-azure-frontend-url>`
- `API_KEY=<starker_schluessel>`

Danach Backend neu starten:

```bash
sudo systemctl restart webapp-backend
sudo systemctl status webapp-backend
```

---

## 6) Azure-Sicherheitsregeln

Wenn du Azure-VMs nutzt:

1. NSG (Network Security Group) anlegen/prüfen.
2. Nur notwendige Ports erlauben:
   - 22 nur von Admin-IP
   - 80/443 öffentlich (für Frontend/Proxy)
   - 3000 nicht öffentlich, wenn vermeidbar
3. Alles andere blockieren.

---

## 7) End-to-End-Test (Pflicht)

Von einem externen Client (nicht nur lokal) prüfen:

1. Frontend lädt in Azure-URL.
2. GET-Requests funktionieren.
3. Schreibende Requests funktionieren nur mit gültigem API-Key.
4. Neue Daten sind in MySQL sichtbar.
5. Fehlerfälle liefern klare Statuscodes (401/403/500 etc.).

Dokumentiere jede Prüfung kurz mit Datum/Uhrzeit.

---

## 8) Troubleshooting für Einsteiger

- **Frontend lädt, API geht nicht**  
  Meist CORS/`ALLOWED_ORIGIN` falsch.
- **Timeouts auf API**  
  Meist Router-Portfreigabe, DDNS oder Firewall-Regel fehlt.
- **DB-Verbindung sporadisch weg**  
  Prüfe feste IPs, Sleep/Power-Optionen am Windows-Host.

---

## Exit-Kriterien Phase 1.3

- Azure-Frontend ist online.
- API-Verbindung von Azure-Frontend zum Backend funktioniert.
- Schreib- und Leseoperationen funktionieren Ende-zu-Ende.
- Sicherheitsregeln (Firewall/NSG/UFW/pfSense) sind gesetzt und dokumentiert.
