# Produktionsnahe Setup-Anleitung (Sprint 5–7)

Diese Anleitung übersetzt die offenen Punkte aus dem letzten Chat in eine **konkret ausführbare Schritt-für-Schritt-Umsetzung**.

## Aufbau der Anleitung

1. **Phase 1 – Infrastruktur-Basis (3 Plattformen)**
   - Datei: `Phase_1_Azure_Ubuntu_DB.md` (mit Verweisen auf Phase 1.1 bis 1.4)
2. **Phase 2 – Netzwerk & Security-Nachweis (pfSense/Firewall)**
   - Datei: `Phase_2_Netzwerk_und_Security.md`
3. **Phase 3 – API-QA gegen produktionsnahe Endpunkte**
   - Datei: `Phase_3_QA_und_API_Tests.md`
4. **Phase 4 – Abgabe-Artefakte & Runbook-Konsolidierung**
   - Datei: `Phase_4_Abgabe_und_Runbook.md`
5. **Bekannte Probleme & Quick-Fixes (2. Setup-Durchlauf)**
   - Datei: `Bekannte_Probleme_und_Quickfixes.md`


---

## Zielbild (kurz)

- **Frontend** läuft auf Plattform A (z. B. Azure Static Web App / VM mit Nginx)
- **Backend (Node.js API)** läuft auf Plattform B (z. B. Ubuntu-VM)
- **Datenbank (MySQL)** läuft auf Plattform C (lokal/LAN-Server)
- DB ist **nicht öffentlich erreichbar**; nur Backend darf zugreifen.

> Hinweis zur realen Umgebung: Die Umsetzung erfolgt **nicht in einem Lab-Netzwerk**, sondern auf einem lokalen Rechner mit Windows (MySQL) sowie lokalen VMs (Ubuntu + pfSense). Azure ist die reale Microsoft-Cloud; aktuell besteht dort vor allem Zugriff per Login und die schrittweise Bereitstellung folgt in Phase 1.3.

### Architektur-Wahl (Platzierung) für Sprint 5–7

- Verbindlich für die aktuelle Umsetzung: **FE in Azure, BE auf Ubuntu-VM, DB lokal**.
- Öffentlicher Zugriff nur via `443` in Azure; `3000` (Backend) und `3306` (DB) bleiben lokal intern und werden über Site-to-Site-VPN angebunden.
- Ein möglicher späterer Evolutionsschritt (nicht Teil der aktuellen Abnahme) ist die Verlagerung des Backends nach Azure.

---

## Reihenfolge heute

1. Phase 1 komplett umsetzen.
2. Phase 2 Regeln setzen und Sperre nachweisen.
3. Phase 3 Smoke- und Negativtests gegen Live-URLs fahren.
4. Phase 4 Artefakte bündeln und finale Doku als Single Source of Truth abschließen.

## Qualitätsvorgaben (verbindlich für alle Phasen)

- Öffentliche Exposition nur über `443` (HTTPS) auf Azure-Komponenten, **kein direkter Internetzugriff auf lokalen Backend-Port `3000`**.
- Datenbank-Port `3306` bleibt intern und ist nur vom Backend erreichbar.
- Secrets nicht im Repository speichern; produktiv Secret-Store nutzen.
- Für Netzwerk/Security muss eine nachvollziehbare Port-Matrix in Phase 2 gepflegt werden.
