# Sprint-Analyse (01 bis 04)

## Sprint 01
- Frontend-Grundgerüst mit Komponentenstruktur für GTC.
- Ansichten: Home, Currencies, Rates, Footer.
- Ziel: statische/simpele Grundstruktur.

## Sprint 02
- Daten sollen dynamisch über REST-Service bezogen werden (JSON).
- Neue Komponente: Calculator (Quellwährung -> Zielwährung).
- Transaktionen persistieren und in Tabelle anzeigen.
- Benutzerverwaltung und Login-Mechanismus ergänzen.

## Sprint 03
- Verbindliche Backend-Vorgaben:
  - Node.js + Express.js
  - MySQL
- Datenbank `gtc` mit nötigen Tabellen (z. B. `currency`, `rate`, `transaction`, `user`).
- RESTful Service erstellen, damit Frontend Daten lesen/schreiben kann.

## Sprint 04
- Testprotokoll mit mindestens 10 Testfällen erstellen.
- README/Installationsanleitung mit allen nötigen Informationen liefern.
- Gesamtabgabe als Projektstand inkl. Frontend + Backend.

## Entscheidung zur Reihenfolge
**Als nächstes wird Sprint 03 umgesetzt**, weil Sprint 02 und Sprint 04 davon abhängen:
1) Ohne Backend können Sprint-02-Anforderungen (dynamische Daten, Persistenz) nicht vollständig fertiggestellt werden.
2) Ohne fertigen End-to-End-Stand sind Sprint-04-Tests und Installationsanleitung nicht sauber möglich.
