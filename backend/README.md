# Civil Supplies Backend (FastAPI)

Backend service for the Civil Supplies monorepo. Handles enquiries, RFQ quotes with BOQ uploads, the product/category catalog, and admin auth.

## Stack
- **FastAPI** — web framework
- **SQLAlchemy 2.x** (typed) — ORM, SQLite by default, Postgres via `DATABASE_URL`
- **Pydantic v2** — validation
- **slowapi** — rate limiting
- **passlib[bcrypt] + python-jose** — password hashing and JWT for admin
- **smtplib** — email notifications

## Setup

All commands assume you are in the `backend/` folder of the monorepo.

```bash
cd backend

# 1. Virtualenv
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# 2. Deps
pip install -r requirements.txt

# 3. Env
cp .env.example .env
# Edit .env: set SECRET_KEY, SEED_ADMIN_PASSWORD, SMTP_*, etc.

# 4. Seed (idempotent — categories, products, admin user)
python scripts/seed.py

# 5. Run
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` for Swagger UI.

## Tests

```bash
pytest -q
```

## Endpoints

| Method & Path | Auth | Purpose |
|---|---|---|
| `POST /api/enquiries` | public, rate-limited | Submit contact form |
| `GET /api/enquiries` | admin (JWT) | List enquiries |
| `PATCH /api/enquiries/{id}` | admin | Update status |
| `POST /api/quotes` | public, rate-limited | Submit RFQ + BOQ upload |
| `GET /api/quotes` | admin | List quotes |
| `GET /api/quotes/{id}/boq` | admin | Download BOQ file |
| `GET /api/products` | public | Filter by `category`, `q`, paginate |
| `GET /api/products/{slug}` | public | Product detail |
| `GET /api/categories` | public | All categories |
| `POST /api/admin/login` | public | Returns JWT |
| `GET /api/admin/me` | admin | Current admin |
| `GET /health` | public | Liveness probe |

## Project structure

```
backend/
├── app/
│   ├── main.py              FastAPI app, CORS, rate limiting
│   ├── config.py            Settings from .env
│   ├── database.py          SQLAlchemy engine + session
│   ├── auth.py              JWT signing + get_current_admin dep
│   ├── models.py            ORM models
│   ├── schemas.py           Pydantic validation
│   ├── email_service.py     SMTP notifier
│   ├── storage.py           local / S3 file storage
│   └── routers/
│       ├── enquiries.py
│       ├── quotes.py
│       ├── products.py
│       ├── categories.py
│       └── admin.py
├── scripts/seed.py
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

## Switching to Postgres

```bash
pip install psycopg2-binary
```

In `.env`:
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/civil_supplies
```

Tables auto-create on startup. Use Alembic once the schema stabilizes.
