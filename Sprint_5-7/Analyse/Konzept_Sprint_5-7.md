# Konzeptanalyse Sprint 5–7 – Verteilte Web-Applikationsarchitektur

## 1) Ausgangslage

### Aktuelle Situation
- Das bestehende Projekt aus Sprint 01–04 enthält bereits:
  - Frontend (GUI / Presentation Layer)
  - Backend (RESTful API / Business-Logik)
  - Relationale Datenbank (Persistenz)
- Bisher wird das System überwiegend monolithisch bzw. lokal betrieben.

### Problemstellung
- Der aktuelle Betrieb ist nicht ausreichend produktionsnah.
- Anforderungen zu **Skalierbarkeit**, **Sicherheit** und **Wartbarkeit** können bei rein lokalem Betrieb nur eingeschränkt erfüllt werden.
- Für Sprint 5–7 soll eine **verteilte Architektur** eingeführt werden, bei der Frontend, Backend und Datenbank auf unterschiedlichen Plattformen laufen.

### Technische Rahmenbedingungen
- Verfügbare Plattformen:
  - Microsoft Azure
  - Ubuntu Linux VM (VMware, vmnet1)
  - Lokale Umgebung (Laptop)
- Netzwerkzugriff über pfSense:
  - ausgehend ins Internet erlaubt
  - Portweiterleitungen erlaubt
- Verpflichtende Projektanforderungen:
  - mindestens 5 REST-Endpunkte (inkl. CRUD + 1 Spezialfall)
  - Business-Logik (z. B. Preisberechnung, Statusübergänge, Validierung)
  - mindestens 3 Tabellen mit Relationen (Foreign Keys)
  - mindestens 5 automatisierte API-Tests
  - Request- und Fehler-Logging
  - Sicherheitsanforderungen (DB nicht öffentlich, Secrets nicht im Code, API-Key/Token)

### Organisatorische Rahmenbedingungen
- Bearbeitung als Einzel- oder Partnerarbeit.
- Zeitbudget: 12 Lektionen.
- Konzeption und Umsetzung müssen dokumentiert und reproduzierbar sein.

### Bezug zum bestehenden Projekt
- Vorhandene Anwendung wird **nicht neu erfunden**, sondern architektonisch erweitert.
- Fokus liegt auf dem Betriebskonzept, auf Deployment, Tests und Sicherheit.

**Zielsetzung:**
Ein belastbares, umsetzbares Konzept für eine produktionsnahe, verteilte 3-Tier-Architektur (Frontend, Backend, Datenbank) mit klaren Sicherheits- und Abnahmekriterien.

---

## 2) Lösungsansatz

### Variante A (bevorzugt)
- **Frontend:** Azure Static Web App / App Service
- **Backend:** Ubuntu VM (Node.js/Express oder vergleichbar)
- **Datenbank:** lokal (z. B. PostgreSQL/MySQL) im isolierten Netz, nur vom Backend erreichbar

### Vorteile
- Gute Trennung der Schichten auf drei Plattformen.
- Frontend ist öffentlich erreichbar und einfach skalierbar.
- Backend bleibt kontrolliert in eigener Linux-Umgebung.
- Datenbank kann stark abgeschottet werden (höchste Sicherheitspriorität).

### Nachteile
- Höhere Netzwerk-Komplexität (Routing, Firewall, NAT, Portweiterleitung).
- Mögliche Latenz zwischen Plattformen.
- Mehr Aufwand bei Monitoring/Fehlersuche über mehrere Systeme.

### Risiken
- Falsch konfigurierte Firewall-Regeln blockieren API oder DB-Verbindung.
- Secrets-Handling uneinheitlich zwischen Plattformen.
- Deployment-Drift durch manuelle Schritte.

---

## 3) Entscheid / Begründung

### Bewertungsmatrix (1 = schlecht, 5 = sehr gut)

| Kriterium | Gewicht | Variante A: FE Azure / BE Ubuntu / DB lokal | Variante B: FE lokal / BE Azure / DB Ubuntu | Variante C: FE Ubuntu / BE lokal / DB Azure |
|---|---:|---:|---:|---:|
| Sicherheit DB-Isolation | 30% | 5 | 4 | 3 |
| Umsetzbarkeit im Zeitrahmen | 25% | 4 | 3 | 2 |
| Wartbarkeit / Betrieb | 20% | 4 | 4 | 3 |
| Nachvollziehbarkeit für Doku | 15% | 5 | 4 | 3 |
| Erweiterbarkeit | 10% | 4 | 4 | 4 |
| **Gesamt (gewichtet)** | 100% | **4.45** | **3.75** | **2.95** |

### Entscheidung
Es wird **Variante A** umgesetzt, da sie die Sicherheitsanforderungen (insb. DB-Abschirmung) am besten erfüllt und gleichzeitig in 12 Lektionen realistisch umsetzbar bleibt.

---

## 4) Grobarchitektur / Umsetzungskonzept

### Systemübersicht
1. Benutzer greift via Browser auf Frontend in Azure zu.
2. Frontend ruft Backend-API über HTTPS auf.
3. Backend validiert Token/API-Key, verarbeitet Business-Logik, schreibt Logs.
4. Backend kommuniziert mit Datenbank über internes Netzwerk/Firewall-Freigabe.
5. Datenbank ist von außen nicht erreichbar.

### Netzwerkplan (inkl. pfSense)
- Öffentlich freigegeben:
  - Frontend-Port (HTTPS/443)
  - optional Backend-API-Port (nur falls notwendig, möglichst restriktiv)
- Nicht öffentlich:
  - DB-Port (z. B. 5432/3306) – nur Backend-IP erlaubt
- pfSense-Regeln:
  - Allow: Backend -> DB Port
  - Deny: Any -> DB Port
  - Restrictive inbound rules für API

### Schnittstellen
- `GET /entities`
- `GET /entities/{id}`
- `POST /entities`
- `PUT /entities/{id}`
- `DELETE /entities/{id}`
- `POST /entities/{id}/status` (Spezialfall)

### Eingesetzte Technologien (Beispiel)
- Frontend: React/Vite oder HTML/JS
- Backend: Node.js + Express
- DB: PostgreSQL/MySQL
- Testing: Postman/Newman oder pytest/jest
- Logging: Winston/Pino bzw. Framework-Logger
- Deployment: `.env`, Startskripte, Runbook

### Sicherheitskonzept
- Authentifizierung: API-Key oder Bearer-Token (mindestens eine Methode verpflichtend)
- Secrets in `.env` / Secret-Datei (nicht im Git)
- CORS nur für erlaubte Frontend-Domain
- Input-Validierung auf Backend-Ebene
- Fehlerantworten ohne sensible interne Details

---

## 5) Risiken und Massnahmen

| Risiko | Kategorie | Eintritt | Auswirkung | Gegenmassnahme |
|---|---|---|---|---|
| Falsche Portweiterleitung | Technisch | Mittel | Hoch | Checkliste + Test pro Port + pfSense-Regelreview |
| DB versehentlich öffentlich | Technisch | Niedrig | Sehr hoch | Default-Deny, externe Port-Scans, Regel "nur Backend-IP" |
| Secrets im Repository | Technisch/Prozess | Mittel | Hoch | `.gitignore`, Secret-Template, Review vor Commit |
| Zeitüberschreitung | Organisatorisch | Mittel | Mittel | MVP zuerst: CRUD + Spezialfall + Tests, dann Optimierungen |
| Unklare Zuständigkeiten im Team | Organisatorisch | Mittel | Mittel | Rollen aufteilen: FE/BE/Infra + täglicher Sync |

---

## 6) Test- und Abnahmekonzept

### Testarten
- **API-Funktionstests:** CRUD + Spezialfall
- **Integrations-Tests:** Backend ↔ Datenbank
- **Sicherheitstests (Basis):**
  - Zugriff auf DB von außen muss fehlschlagen
  - API ohne Token/API-Key muss 401/403 liefern
- **Smoke-Tests nach Deployment:** End-to-End Haupt-Use-Case

### Teststrategie
1. Lokale Entwicklungstests pro Komponente
2. Integration auf verteilter Zielarchitektur
3. Automatisierte API-Tests (mind. 5) via Newman oder pytest/jest
4. Ergebnisprotokoll in `Abgabe/` (Screenshots/Logauszüge/Testreport)

### Abnahmekriterien (prüfbar)
- Drei Plattformen werden effektiv genutzt.
- System ist lauffähig (Frontend erreichbar, API funktionsfähig, DB verbunden).
- Mindestens 5 API-Tests laufen erfolgreich.
- Request- und Fehler-Logs sind vorhanden.
- DB ist nicht öffentlich exponiert.
- Deployment-Dokumentation erlaubt reproduzierbaren Neuaufbau.

---

## Lieferobjekte (für Sprint_5-7)
- `Auftrag/`: formaler Arbeitsauftrag / Aufgabenbeschreibung
- `Analyse/`: dieses Konzeptdokument
- `Abgabe/`: Umsetzungsnachweise (Tests, Doku, Belege)

