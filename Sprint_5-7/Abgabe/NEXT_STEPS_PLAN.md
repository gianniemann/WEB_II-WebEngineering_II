# Sprint 5–7: Konkreter Nächster Schrittplan

Dieses Dokument übersetzt den aktuellen Umsetzungsstand in eine **ausführbare Reihenfolge**.

## 1) Was als Nächstes zu tun ist (Priorität)

1. **Live-Zielumgebung finalisieren (3 Plattformen aktiv)**
   - Frontend, Backend, DB gemäss Zielarchitektur verbinden.
   - Prüfen, dass Frontend wirklich auf Live-Backend zeigt.
2. **Security-Nachweis abschliessen**
   - Externer Test auf DB-Port (`3306`) muss fehlschlagen.
   - Interner Backend→DB-Zugriff muss funktionieren.
3. **API-Tests gegen Live-URL ausführen**
   - Testlauf inkl. Negativfall und Domainregel sichern.
4. **Abgabe-Artefakte bündeln**
   - Testreport, Log-Auszüge, Firewall-Nachweis, Screenshots in Artefaktordner ablegen.

---

## 2) Was bereits vorbereitet ist

- Konzept, Architektur, Netzwerk- und Security-Phasen sind dokumentiert unter:
  - `Sprint_5-7/Analyse/Konzept_Sprint_5-7.md`
  - `Sprint_5-7/Analyse/Infrastrucutre/README.md`
  - `Sprint_5-7/Analyse/Infrastrucutre/Phase_1_Azure_Ubuntu_DB.md`
  - `Sprint_5-7/Analyse/Infrastrucutre/Phase_2_Netzwerk_und_Security.md`
  - `Sprint_5-7/Analyse/Infrastrucutre/Phase_3_QA_und_API_Tests.md`
  - `Sprint_5-7/Analyse/Infrastrucutre/Phase_4_Abgabe_und_Runbook.md`

- API-Smoke-Testskript wurde für Live-Tests erweitert:
  - Datei: `Sprint_5-7/Abgabe/tests/api_smoke_tests.py`
  - Enthält 5 Kernchecks inkl. Negativfall + Domainregel (`cancelled` darf nicht mehr auf `approved`).
  - Kann optional einen JSON-Report schreiben (`REPORT_PATH=...`).

---

## 3) Direkter Ausführungsblock (copy/paste)

> Diese Befehle auf dem **Backend-Host** ausführen (oder auf einem Host mit Zugriff auf das Live-Backend):

```bash
cd /workspace/WEB_II-WebEngineering_II
export API_BASE_URL="https://<dein-backend-host>/api"
export API_KEY="<dein-api-key>"
export REPORT_PATH="Sprint_5-7/Abgabe/artefakte/tests/api_smoke_report.json"
python3 Sprint_5-7/Abgabe/tests/api_smoke_tests.py
```

Wenn dein Backend absichtlich keinen API-Key erzwingt, ist das für Sprint 5–7 nicht ausreichend. Dann zuerst API-Key enforcement aktiv lassen und erneut testen.

---

## 4) Wo du welche Information im Repo findest

- **Gesamtauftrag / Muss-Kriterien**:  
  `Arbeitsauftrag Sprint 05-07.pdf  CONVERTED FROM PDF TO .txt`
- **Aktueller Projektstatus / offene Punkte**:  
  `Sprint_5-7/Abgabe/Umsetzungsstand_Sprint_5-7.md`
- **Detaillierte Infrastruktur-Schritte**:  
  `Sprint_5-7/Analyse/Infrastrucutre/`
- **Backend-Implementierung (Security, Logging, Domainregel)**:  
  `Abgabe/backend/src/server.js`
- **DB-Schema (3 Tabellen, FK-Beziehungen, Seeds)**:  
  `Abgabe/backend/sql/init.sql`

---

## 5) Definition of Done (kurz)

Du bist „abgabebereit“, wenn alle Punkte erfüllt sind:

- [ ] FE/BE/DB laufen auf 3 unterschiedlichen Plattformen.
- [ ] DB extern nicht erreichbar (Nachweis vorhanden).
- [ ] Mind. 5 API-Tests gegen Live-System erfolgreich.
- [ ] Negativfall dokumentiert (401/403 und/oder Domainregel 409).
- [ ] Request- und Error-Logs als Evidenz abgelegt.
- [ ] Reproduzierbare Schritt-für-Schritt-Doku final konsolidiert.
