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

---

## Zielbild (kurz)

- **Frontend** läuft auf Plattform A (z. B. Azure Static Web App / VM mit Nginx)
- **Backend (Node.js API)** läuft auf Plattform B (z. B. Ubuntu-VM)
- **Datenbank (MySQL)** läuft auf Plattform C (lokal/LAN-Server)
- DB ist **nicht öffentlich erreichbar**; nur Backend darf zugreifen.

---

## Reihenfolge heute

1. Phase 1 komplett umsetzen.
2. Phase 2 Regeln setzen und Sperre nachweisen.
3. Phase 3 Smoke- und Negativtests gegen Live-URLs fahren.
4. Phase 4 Artefakte bündeln und finale Doku als Single Source of Truth abschließen.
