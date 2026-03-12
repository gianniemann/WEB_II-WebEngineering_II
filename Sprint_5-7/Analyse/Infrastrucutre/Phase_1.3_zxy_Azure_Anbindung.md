# Phase 1.3 zxy – Azure-Umgebung anbinden (Frontend + sichere Erreichbarkeit)

> Ziel dieser Phase: Azure als „öffentliche Schicht“ nutzen und dein lokales VMware-Setup kontrolliert anbinden.

---

## 0) Ergebnis dieser Phase

Am Ende hast du:

- Eine Azure-Ressourcengruppe.
- Ein Frontend-Hosting in Azure (primär über Static Web Apps).
- Eine VPN-Anbindung Azure <-> lokal (pfSense), ohne lokale Internet-Portfreigaben für Backend/DB.
- Funktionierende End-to-End-Tests (Browser -> Azure API-Einstieg -> VPN -> lokales Backend -> MySQL).

---

## 1) Verbindliche Architektur für dieses Projekt

Für dieses Projekt ist **ausschließlich Variante A** gültig:

### Variante A (verbindlich): Nur Frontend in Azure
- Azure hostet nur die statische Oberfläche.
- Backend bleibt auf lokaler Ubuntu-VM.
- MySQL bleibt lokal auf Windows.
- Öffentlicher API-Zugriff erfolgt über einen Azure-API-Einstieg auf `443`.
- Azure erreicht das lokale Backend über **Site-to-Site-VPN**.

> Hinweis: Eine Verlagerung des Backends nach Azure ist **nicht Teil dieser Umsetzung** und wird in dieser Anleitung nicht behandelt.

### Aktueller Stand

- In Azure ist aktuell primär der Zugang (Login) vorhanden.
- Die konkrete Bereitstellung von Ressourcen erfolgt in dieser Phase schrittweise.
- Interne IP-Adressen in Beispielen sind Platzhalter und müssen auf dein reales VM-Netz angepasst werden.

---

## 2) Azure Grundaufbau (Schritt für Schritt)

1. Im Azure Portal anmelden.
2. Neue **Resource Group** anlegen (z. B. `rg-webii-prod`).
3. Region wählen (z. B. `West Europe`).
4. Tags setzen (z. B. `project=webii`, `stage=sprint5-7`, `owner=<name>`).
5. Kostenkontrolle aktivieren:
   - Budget erstellen
   - Kostenwarnung ab festem Betrag konfigurieren

**Check:**
- Resource Group existiert.
- Budget-Alert ist aktiv.

---

## 3) Frontend in Azure bereitstellen (empfohlen: Static Web App)

### 3.1 Static Web App erstellen

1. „Create Resource“ -> „Static Web App“.
2. Subscription + Resource Group auswählen.
3. Name vergeben (z. B. `webii-frontend-prod`).
4. Hosting Plan/Region wählen.
5. Repository verbinden (GitHub oder Azure DevOps).
6. Build-Details setzen:
   - App location: je nach Projektstruktur (z. B. `/frontend`)
   - Output location: z. B. `dist` oder `build`
7. Erstellen und initiales Deployment abwarten.

### 3.2 Produktions-URL prüfen

- SWA-URL notieren (z. B. `https://nice-app.azurestaticapps.net`).
- Im Browser aufrufen und prüfen, ob das Frontend lädt.

### 3.3 Frontend-Konfiguration für API-URL

Setze die API-Basisadresse auf den **öffentlichen Azure-API-Einstieg**:

```env
API_BASE_URL=https://api.deinprojekt.de
```

> Wichtig: Bei Static Web Apps laufen API-Calls im Browser des Users. Deshalb darf `API_BASE_URL` keine private lokale IP enthalten.

Falls dein Frontend Build-Time-Variablen nutzt (z. B. Vite/React), prüfe die korrekten Präfixe (`VITE_...`, `REACT_APP_...`) und baue neu.

---

## 4) Azure VPN Service zur lokalen Maschine (pfSense) einrichten

Ziel: Azure soll das lokale Backend privat erreichen, ohne lokale Portfreigaben für `3000`/`3306`.

### 4.1 Azure-Netzwerk vorbereiten

1. **Virtual Network (VNet)** anlegen (z. B. `10.50.0.0/16`).
2. Subnetze anlegen:
   - `app-subnet` (z. B. `10.50.1.0/24`)
   - `GatewaySubnet` (z. B. `10.50.255.0/27`, Name muss exakt `GatewaySubnet` heißen)
3. Sicherstellen, dass sich VNet-CIDR und lokales Netz (z. B. `192.168.10.0/24`) nicht überlappen.

### 4.2 Azure VPN Gateway erstellen

1. Ressource **Virtual network gateway** erstellen.
2. Typ: `VPN`.
3. VPN-Typ: `Route-based`.
4. SKU: z. B. `VpnGw1` (projektabhängig).
5. Public IP für Gateway erstellen.
6. Deployment abwarten (kann 30–45 Minuten dauern).

### 4.3 Local Network Gateway (lokale Seite) definieren

1. Ressource **Local network gateway** erstellen.
2. Public IP/FQDN deiner lokalen pfSense-WAN eintragen (statisch oder DDNS).
3. Lokale Address Spaces eintragen (z. B. `192.168.10.0/24`).

### 4.4 Verbindung Azure <-> pfSense erstellen

1. Auf Azure-Seite im VPN Gateway: **Connection** erstellen (`Site-to-site (IPsec)`).
2. Ziel: zuvor erstelltes Local Network Gateway.
3. Shared Key (PSK) festlegen und sicher speichern.
4. Auf pfSense IPsec-Tunnel konfigurieren (IKEv2, route-based entsprechend Azure).
5. Gleichen PSK, lokale/remote Netzwerke und Proposal-Parameter eintragen.

### 4.5 Routen und Firewall prüfen

- pfSense/IPsec-Regeln müssen Traffic aus Azure-VNet zum Backend erlauben (`TCP 3000`).
- UFW auf Ubuntu: Zugriff auf `3000` nur aus Azure-VNet/VPN-Subnetz erlauben.
- Kein NAT/Portforward für Backend/DB ins Internet.

**Check:**
- Azure Connection Status = `Connected`.
- Von einer Azure-Test-VM (im VNet): `curl http://<UBUNTU_BACKEND_IP>:3000/api/health` erfolgreich.
- Von externem Internet: `3000` und `3306` auf lokaler WAN-IP weiterhin geschlossen.

---

## 5) Öffentlichen API-Einstieg in Azure konfigurieren (443)

Da der Browser nicht direkt über VPN ins lokale Netz geht, brauchst du einen Azure-Einstiegspunkt:

- z. B. Azure API Management / Application Gateway / Azure App Service als Reverse Proxy.
- Öffentlich erreichbar via `https://api.deinprojekt.de`.
- Weiterleitung intern über VPN auf `http://<UBUNTU_BACKEND_IP>:3000`.

Beispielprinzip:
- Internet -> Azure API-Einstieg (`443`) -> VPN-Tunnel -> lokales Backend (`3000`).

---

## 6) Backend-Konfiguration für Azure-Frontend

Im Backend `.env` prüfen:

- `ALLOWED_ORIGIN=https://<deine-azure-frontend-url>`
- `API_KEY=<starker_schluessel>`

Wichtig:
- In Produktion keine Wildcards bei CORS.
- Keine Secrets im Repository speichern.

Danach Backend neu starten:

```bash
sudo systemctl restart webapp-backend
sudo systemctl status webapp-backend
```

---

## 7) End-to-End-Testplan (Pflicht)

Von einem externen Client testen:

1. Frontend lädt über Azure-URL.
2. `GET`-Requests funktionieren.
3. Schreibende Requests funktionieren nur mit gültigem API-Key.
4. Neue Daten sind in MySQL sichtbar.
5. Fehlerfälle liefern saubere Codes (401/403/500).

Empfohlene Schnelltests:

```bash
curl -i https://api.deinprojekt.de/api/health
curl -i https://api.deinprojekt.de/api/<dein-endpunkt>
curl -i -H "x-api-key: FALSCH" https://api.deinprojekt.de/api/<geschuetzter-endpunkt>
```

Zusatztest (Azure-intern):

```bash
curl -i http://<UBUNTU_BACKEND_IP>:3000/api/health
```

Dokumentiere jeden Test mit Datum/Uhrzeit und Ergebnis.

---

## 8) Typische Stolpersteine (projektbezogen)

1. **VPN bleibt „Not Connected“**
   - Ursache: falscher PSK, Proposal-Mismatch, falsche WAN-IP/DDNS.
   - Lösung: PSK/Phase1+2-Parameter und Remote Gateway Adresse auf beiden Seiten angleichen.

2. **SWA lädt, API bleibt unerreichbar**
   - Ursache: API-URL zeigt auf private IP statt Azure-API-Domain.
   - Lösung: `API_BASE_URL` auf öffentliche Azure-API-Domain setzen.

3. **Azure API-Einstieg antwortet 502/504**
   - Ursache: VPN down oder Route zum lokalen Subnetz fehlt.
   - Lösung: Azure Connection Status prüfen, UDR/Route und pfSense-IPsec-Regeln prüfen.

4. **CORS-Fehler trotz richtiger Domain**
   - Ursache: `ALLOWED_ORIGIN` nicht exakt (Schema/Subdomain/Slash).
   - Lösung: Origin exakt setzen und Backend neu starten.

5. **403/401 unerwartet**
   - Ursache: API-Key fehlt/falsch oder Header-Name stimmt nicht.
   - Lösung: Header-Verwendung (`x-api-key`) im Frontend und Proxy prüfen.

6. **DB-Verbindung sporadisch weg**
   - Ursache: Windows Host wechselt IP oder geht in Sleep.
   - Lösung: feste IP/DHCP-Reservierung + Sleep-Einstellungen anpassen.

---

## 9) Konzeptionelle Auswirkungen auf andere Dokumente

Durch die VPN-Entscheidung ändern sich folgende Annahmen:

- Lokales Port-Forwarding für Backend (`3000`) ist obsolet.
- Sicherheitsnachweise müssen zusätzlich den **VPN-Status** und Azure->lokal Erreichbarkeit über den Tunnel abdecken.
- Regeln in pfSense/UFW beziehen sich auf Azure-VNet/VPN-Subnetze statt auf „Internet-Quellen“.

Diese Anpassungen sind in Phase 1.2 und Phase 2 bereits nachgezogen; prüfe dort nur noch deine realen CIDRs/IPs.

---

## Exit-Kriterien Phase 1.3

- Azure-Frontend ist online.
- Site-to-Site-VPN (Azure VPN Gateway <-> pfSense) ist stabil verbunden.
- API-Verbindung vom Azure-Frontend zum lokalen Backend funktioniert stabil.
- Lese- und Schreiboperationen funktionieren Ende-zu-Ende.
- Externe Erreichbarkeit ist auf `443` in Azure begrenzt; lokal sind `3000` und `3306` extern geschlossen.
- Sicherheitsregeln (Firewall/NSG/UFW/pfSense) sind gesetzt und dokumentiert.
