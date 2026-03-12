# Phase 1.1 xyz – Lokale MySQL-Umgebung auf Windows (Start bei 0)

> Ziel dieser Phase: Eine **funktionierende, lokale Datenbank** auf deinem Windows-Rechner bereitstellen, die später von der Ubuntu-Backend-VM genutzt wird.

---

## 0) Was du am Ende haben sollst

Wenn du fertig bist, ist folgendes erreicht:

- MySQL Server läuft auf deinem Windows-Host.
- Eine Projekt-Datenbank ist angelegt.
- Das SQL-Initialskript wurde ausgeführt.
- Es gibt einen separaten DB-Benutzer (nicht `root`) für dein Backend.
- Zugriff ist getestet (lokal und später aus Ubuntu-VM).

---

## 1) Voraussetzungen (einmalig prüfen)

1. **Windows-Adminrechte** auf deinem Rechner.
2. Projekt liegt lokal vor (inkl. `Abgabe/backend/sql/init.sql`).
3. VMware ist installiert (für spätere Ubuntu-VM).
4. Du kennst grob dein Heimnetz bzw. lokales VM-Netz (z. B. `192.168.178.0/24`).

Tipp für Anfänger:
- Notiere alle IPs/Passwörter in einer kleinen Tabelle (z. B. OneNote/Excel), damit du später nichts suchst.

---

## 2) MySQL Server unter Windows installieren

1. Öffne die offizielle MySQL-Seite und lade den **MySQL Installer** (Community Edition) herunter.
2. Starte den Installer als Administrator.
3. Wähle Setup-Typ **Server only** (oder **Developer Default**, falls du Workbench mit installieren willst).
4. Bei der Konfiguration:
   - Type: **Standalone MySQL Server**
   - Networking: Port **3306**
   - Authentication: Standard belassen
   - Root-Passwort setzen (sicher und notieren)
5. Als Windows Service installieren:
   - Service Name z. B. `MySQL80`
   - Start at System Startup aktiv lassen
6. Installation abschließen und Dienst starten.

Kontrolle:
- Öffne `services.msc` und prüfe, dass `MySQL80` auf **Running/Wird ausgeführt** steht.

---

## 3) Projekt-Datenbank und Benutzer anlegen

Du kannst dafür MySQL Workbench oder die Kommandozeile nutzen. Für Einsteiger ist Workbench einfacher.

### Variante A (Workbench)

1. Verbinde dich lokal als `root`.
2. Führe folgende SQL-Befehle aus (Namen ggf. an dein Projekt anpassen):

```sql
CREATE DATABASE IF NOT EXISTS webapp_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'webapp_user'@'%' IDENTIFIED BY 'SEHR_STARKES_PASSWORT';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX ON webapp_prod.* TO 'webapp_user'@'%';
FLUSH PRIVILEGES;
```

3. Danach dein Initialskript ausführen:
   - Datei: `Abgabe/backend/sql/init.sql`

### Variante B (MySQL CLI)

```bash
mysql -u root -p
```

Dann die gleichen SQL-Befehle wie oben eingeben.

---

## 4) Zugriff über Netzwerk vorbereiten (wichtig für Ubuntu-VM)

Standardmäßig erlaubt MySQL lokale Zugriffe, aber für die Ubuntu-VM muss der Dienst über Netzwerk erreichbar sein.

1. Öffne die MySQL-Konfigurationsdatei (`my.ini`) unter Windows.
2. Suche `bind-address`.
3. Setze für dein lokales Setup z. B.:
   - `bind-address = 0.0.0.0`
4. MySQL-Dienst neu starten (`services.msc`).

Sicherheitshinweis:
- `0.0.0.0` ist okay im privaten lokalen Netz, **wenn** du die Windows-Firewall korrekt einschränkst (nächster Schritt).

---

## 5) Windows-Firewall-Regel für Port 3306 setzen

1. Öffne **Windows Defender Firewall mit erweiterter Sicherheit**.
2. Neue eingehende Regel:
   - Typ: Port
   - TCP 3306
   - Verbindung zulassen
   - Profile: nur das benötigte Profil (meist Privat)
3. Unter **Bereich/Scope** einschränken:
   - Nur IP der Ubuntu-VM (oder später pfSense-LAN-Netz)
4. Regel sinnvoll benennen, z. B. `MySQL 3306 from Ubuntu Backend only`.

Wichtig:
- Keine Regel „für alle Quellen aus dem Internet“ erlauben.

---

## 6) Funktionstest lokal

PowerShell öffnen:

```powershell
mysql -u webapp_user -p -h 127.0.0.1 -P 3306 webapp_prod
```

Testabfrage:

```sql
SHOW TABLES;
SELECT NOW();
```

Wenn Tabellen aus `init.sql` sichtbar sind, ist die Basis korrekt.

---

## 7) Dokumentation für die nächsten Phasen

Notiere diese Werte für Phase 1.2 und 1.3:

- DB-Host-IP (Windows-Host im lokalen Netz)
- DB-Port (`3306`)
- DB-Name
- DB-Benutzer
- DB-Passwort

Ohne diese Daten kann das Backend später nicht starten.

---

## 8) Typische Fehler + schnelle Lösung

- **Fehler:** `Can't connect to MySQL server`  
  **Ursache:** Dienst läuft nicht / Firewall blockiert / falsche IP.
- **Fehler:** `Access denied for user`  
  **Ursache:** Benutzer/Passwort falsch oder keine Rechte auf DB.
- **Fehler:** Tabellen fehlen  
  **Ursache:** `init.sql` wurde noch nicht ausgeführt oder in falscher DB ausgeführt.

---

## Exit-Kriterien Phase 1.1

- MySQL läuft stabil auf Windows.
- `init.sql` wurde erfolgreich importiert.
- Benutzer `webapp_user` (oder eigener Name) funktioniert.
- Zugriff auf 3306 ist auf dein lokales Netz bzw. Ubuntu-VM eingeschränkt.
