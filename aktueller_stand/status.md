# Aktueller Stand

## Done
- Einfache Frontend-Basis für Sprint 01 bis 04 ist vorhanden (`03_Sprint_Umsetzung`), im Stil der Demo-Beispiele.
- Sprint 03 Backend ist vorhanden (`backend/` mit Express, MySQL-Schema, REST-Endpunkten).
- Sprint 02 Frontend-Integration ist umgesetzt (REST-Aufrufe, Calculator, Login, Transactions inkl. Fallback-Daten).
- **Sprint 04 wurde gestartet und umgesetzt**:
  - Testprotokoll mit mindestens 10 Testfällen erstellt (`04_Test/testprotokoll.md`).
  - Installationsanleitung für das Gesamtprojekt erstellt (`README.md`).

## Entscheidung nach Sichtung von `01_Sprints`
Als nächster Schritt wurde **Sprint 04** umgesetzt, weil die geforderten Artefakte (Testprotokoll + Installationsanleitung) noch gefehlt haben und unabhängig vom letzten Feinschliff sofort lieferbar waren.

## Nächstes aus `01_Sprints`
1. **Sprint 03 final abschliessen**
   - Backend lokal mit echter MySQL-Instanz vollständig testen.
   - Endpunkte fachlich mit realen Requests verifizieren.
2. **Sprint 02 final abschliessen**
   - End-to-End-Flow Frontend <-> Backend vollständig durchtesten.
   - Kleine Validierungsverbesserungen im Frontend ergänzen.
3. **Sprint 04 pflegen**
   - Testprotokoll bei jedem Testlauf nachführen.
   - README bei Änderungen an Setup/Abhängigkeiten aktualisieren.

## ToDo (konkret)
- [ ] Vollständigen API-Testlauf mit laufender MySQL-Instanz durchführen und dokumentieren.
- [ ] End-to-End-Test Frontend/Backend inklusive Login und Transaktion durchführen und dokumentieren.
- [ ] Nach den Tests offene Fehler beheben und Status erneut aktualisieren.
