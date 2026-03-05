# System Übersicht

_Stand: 2026-03-05_

## Ziel
Kurze, professionelle Übersicht der 3-Tier-Architektur für Sprint 5–7.

## Architekturdiagramm
```mermaid
flowchart LR
    U[Benutzer\nBrowser] --> FE[Frontend\nPresentation Tier\n(Azure oder lokal)]
    FE -->|HTTPS 443 / API Calls| BE[Backend API\nBusiness Tier\n(Ubuntu VM)]
    BE -->|SQL 3306 intern| DB[(Datenbank\nPersistence Tier\n(Local/VM))]
    BE --> LOG[(Request-/Error-Logs)]

    classDef public fill:#e8f5ff,stroke:#2a5d9f,stroke-width:1px;
    classDef internal fill:#f3f8e8,stroke:#5f7a1f,stroke-width:1px;
    classDef secure fill:#fff0f0,stroke:#a33,stroke-width:1px;

    class U,FE public;
    class BE,LOG internal;
    class DB secure;
```

## Schnittstellenübersicht
| Layer | Aufgabe | Technologievorschlag |
|---|---|---|
| Frontend | Anzeige, Eingaben, API-Aufrufe | HTML/JS oder React |
| Backend | Business-Logik, Auth, Logging | Node.js + Express |
| Datenbank | Persistenz, Relationen, Constraints | MySQL/PostgreSQL |

## Endpunkt-Mindestumfang
- `GET /api/<resource>`
- `GET /api/<resource>/:id`
- `POST /api/<resource>`
- `PUT /api/<resource>/:id`
- `DELETE /api/<resource>/:id`
- `POST /api/<resource>/:id/status` (Spezialfall)

## Sicherheits-Check
- [ ] DB ist nicht öffentlich exponiert
- [ ] DB nur vom Backend erreichbar
- [ ] Secrets nur via `.env` / Secret-Datei
- [ ] Authentifizierung über Token oder API-Key aktiv
