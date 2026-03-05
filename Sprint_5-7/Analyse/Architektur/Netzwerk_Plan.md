# Netzwerk Plan

_Stand: 2026-03-05_

## Ziel
Einfache visuelle Referenz für Netzwerkzonen, pfSense-Regeln und erlaubte Verbindungen.

## Netzwerkdiagramm
```mermaid
flowchart TB
    Internet((Internet))
    PFS[pfSense Firewall / NAT]
    FE[Frontend Host\nPublic Endpoint\n443]
    BE[Backend Host\nPrivate/API Segment\n3000 oder 443]
    DB[(DB Host\nPrivate Segment\n3306)]

    Internet -->|HTTPS 443| PFS
    PFS -->|Allow 443| FE
    FE -->|Allow API 443/3000| PFS
    PFS -->|Restriktiv nur FE -> BE| BE
    BE -->|Allow 3306 nur BE -> DB| DB

    Internet -. Block .-> DB

    classDef edge fill:#eef6ff,stroke:#2a5d9f,stroke-width:1px;
    classDef core fill:#f5f5f5,stroke:#666,stroke-width:1px;
    classDef private fill:#eef9ee,stroke:#3a7d3a,stroke-width:1px;
    classDef denied fill:#fff0f0,stroke:#a33,stroke-width:1px;

    class Internet edge;
    class PFS core;
    class FE,BE private;
    class DB denied;
```

## Beispiel-Regelmatrix
| Quelle | Ziel | Port | Aktion | Zweck |
|---|---|---:|---|---|
| Internet | Frontend | 443 | Allow | UI erreichbar |
| Frontend | Backend | 443/3000 | Allow (restriktiv) | API-Aufrufe |
| Backend | Datenbank | 3306 | Allow | Datenbankzugriff |
| Internet | Datenbank | 3306 | Deny | DB nicht öffentlich |

## pfSense-/Security-Checkliste
- [ ] Inbound nur notwendige Ports offen
- [ ] DB-Port extern nicht erreichbar
- [ ] API ohne Token/API-Key liefert 401/403
- [ ] Request- und Error-Logging aktiv
- [ ] Portweiterleitungen vollständig dokumentiert
