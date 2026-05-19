# Civil Supplies

Monorepo for the Civil Engineering Supplies website (B2B quote-only).

The single source of truth for scope, stack, and conventions is [PROJECT_BRIEF.md](./PROJECT_BRIEF.md). Read it before making changes.

## Layout

```
civil-supplies/
├── PROJECT_BRIEF.md          source of truth
├── backend/                  FastAPI + SQLAlchemy 2.x + Pydantic v2
│   ├── app/
│   ├── tests/
│   ├── scripts/
│   ├── requirements.txt
│   └── README.md             how to run the backend
├── frontend/                 Next.js 14 (App Router) + Tailwind + shadcn/ui
├── infra/                    AWS deployment runbook + boto3 scripts
├── docker-compose.yml        local: postgres + backend + frontend
└── Makefile                  up / down / logs / seed / test
```

## Quick start

```bash
# Backend
cd backend && uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm run dev

# Both via docker-compose
make up
```

See `backend/README.md` and `frontend/README.md` for service-level details.
