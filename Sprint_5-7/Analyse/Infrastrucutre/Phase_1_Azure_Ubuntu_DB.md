# Phase 1 – Infrastruktur-Basis (Frontend/Backend/DB getrennt)

Diese Datei ist jetzt die **Startseite für Phase 1**.
Die ursprüngliche Kurzfassung wurde in mehrere, anfängerfreundliche Teilphasen aufgeteilt.

## Neue Teilphasen (detailliert)

1. **Phase 1.1 xyz – Lokale MySQL-Umgebung auf Windows (Start bei 0)**
   Datei: `Phase_1.1_xyz_MySQL_Lokal.md`

2. **Phase 1.2 yzx – Ubuntu-Backend-VM in VMware + pfSense-Grundaufbau**
   Datei: `Phase_1.2_yzx_Ubuntu_VM_und_pfSense.md`

3. **Phase 1.3 zxy – Azure-Umgebung anbinden (Frontend + sichere Erreichbarkeit)**
   Datei: `Phase_1.3_zxy_Azure_Anbindung.md`

4. **Phase 1.4 – Betrieb, Backup und Wiederanlauf (optional, empfohlen)**
   Datei: `Phase_1.4_Betrieb_Checkliste_und_Backup.md`

---

## Warum diese Aufteilung?

Die Reihenfolge ist nun für Einsteiger klarer:

1. Zuerst Datenbank stabil aufsetzen (MySQL).
2. Danach Ubuntu-Backend + Netzwerk über pfSense.
3. Anschließend Azure als öffentliche Schicht integrieren.
4. Optional den Betrieb mit Backup/Restore absichern.

---

## Minimale Erfolgskriterien für Phase 1 gesamt

- FE/BE/DB sind getrennt und eindeutig dokumentiert.
- Backend spricht zuverlässig mit der DB.
- Frontend erreicht das Live-Backend.
- Sicherheitsregeln sind aktiv (mindestens Firewall/UFW/pfSense).
