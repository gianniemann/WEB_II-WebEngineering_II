# Aktueller Stand

## Done
- Einfache Frontend-Basis für Sprint 01 bis 04 ist vorhanden (`03_Sprint_Umsetzung`), im Stil der Demo-Beispiele.
- Die Kernmuster aus den Demos sind umgesetzt (Variable, Array, Objekt, Schleifen, forEach).
- Sprint-Dokumente 01 bis 04 wurden inhaltlich ausgelesen und die nächsten Schritte priorisiert.

## Nächstes aus `01_Sprints`
1. **Sprint 03 zuerst umsetzen (höchste Priorität)**
   - MySQL-Datenbank `gtc` inkl. Tabellen aufbauen (`currency`, `rate`, `transaction`, `user`).
   - RESTful Web Service mit **Node.js + Express.js** erstellen.
   - Endpunkte für Lesen/Schreiben bereitstellen, damit das Frontend echte Daten statt Mock-Daten nutzt.
2. **Sprint 02 danach vervollständigen**
   - Frontend an REST-Service anbinden (Currencies, Rates, Calculator, Transactions).
   - Währungstransaktionen vom Frontend an Backend senden und wieder anzeigen.
   - Einfache Benutzerverwaltung/Login gemäss Aufgabenstellung ergänzen.
3. **Sprint 04 zum Schluss liefern**
   - Testprotokoll mit mindestens 10 Testfällen erstellen.
   - Installationsanleitung als `README.md` erstellen (Software, Versionen, DB-Skript, Logins, Deployment-Schritte).

## ToDo (konkret)
- [ ] Backend-Grundgerüst (`backend/`) mit Express-Server anlegen.
- [ ] DB-Schema als SQL-Datei erfassen (`backend/sql/init.sql`).
- [ ] Erste API-Routen für `currencies` und `rates` implementieren.
- [ ] Frontend in `03_Sprint_Umsetzung` schrittweise auf API umstellen.
- [ ] Testprotokoll und README gemäss Sprint 04 vorbereiten.
