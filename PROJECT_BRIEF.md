# PROJECT BRIEF — Civil Engineering Supplies Website

> **Read this file first.** It is the single source of truth for this project. Any prompt the user sends should be interpreted against the context, stack, and scope defined here.

---

## 1. Business context

- **Owner:** Mohan Kumar, based in Hyderabad, India.
- **Business:** Civil engineering supplies and services — supplies construction materials (cement, TMT steel, bricks/blocks, aggregates, RMC, chemicals, tools, safety gear, surveying instruments) and offers services (material supply & delivery, site survey & estimation, bulk procurement, RMC pumping, equipment rental, technical consultation, project material planning).
- **Customers:** Builders, contractors, infrastructure firms, primarily in Telangana & Andhra Pradesh.
- **Primary website goals:**
  1. Let prospects submit **contact enquiries**.
  2. Let bulk buyers submit **RFQs (Request for Quote)** with BOQ file uploads.
  3. Showcase **products** (catalog with categories, no public pricing — quote-only).
  4. Showcase **services**.
  5. Give the owner an **admin panel** to read enquiries and quotes.

---

## 2. Tech stack (locked)

| Layer | Choice |
|---|---|
| Frontend | **Next.js 14** (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Form handling | react-hook-form + zod |
| HTTP client | fetch (centralized in `lib/api.ts`), reads `NEXT_PUBLIC_API_URL` |
| Backend | **FastAPI** (Python 3.11+) + SQLAlchemy 2.x + Pydantic v2 |
| Database | SQLite for local dev, **PostgreSQL** for production |
| Auth | JWT (HS256) for the admin panel only — public endpoints are unauthenticated but rate-limited |
| Email | SMTP via `smtplib` — works with Gmail app passwords, SendGrid, or AWS SES |
| File uploads | Local disk in dev (`./uploads`), **AWS S3** in production (presigned URLs) |
| Rate limiting | slowapi (already wired in) |
| Deploy target | **AWS** — Amplify or S3+CloudFront for frontend; EC2 (t3.small) + RDS Postgres + SES + S3 for backend |
| Containerization | Docker + docker-compose for local; same image runs on EC2 |

**Do not introduce new frameworks** (no Django, no Express, no Vite, no Prisma) unless the user explicitly asks.

---

## 3. Visual design

- Color palette: **navy blue (#0F2C5C)**, **white (#FFFFFF)**, **construction orange (#F58220)** as accent.
- Typography: Inter for body, Inter Display or Plus Jakarta Sans for headings.
- Style: clean, professional, trust-forward — not flashy. Construction/B2B feel.
- Always include: floating **WhatsApp button**, sticky mobile **"Get Quote"** CTA, GST number in footer.

---

## 4. Pages (frontend)

| Route | Purpose |
|---|---|
| `/` | Hero, product categories, why-choose-us, services snippet, testimonials, CTA |
| `/products` | Catalog with category filter + search; cards have "Request Quote" not price |
| `/products/[slug]` | Product detail page |
| `/services` | Services list with icons + CTA |
| `/about` | Company story, mission, certifications |
| `/contact` | Enquiry form → `POST /api/enquiries` + map embed + WhatsApp + phone |
| `/quote` | RFQ form with BOQ file upload → `POST /api/quotes` |
| `/admin` | Login → `POST /api/admin/login` |
| `/admin/dashboard` | Protected, lists enquiries + quotes, search/filter, mark status |

---

## 5. Backend endpoints (target final state)

| Method & Path | Auth | Purpose |
|---|---|---|
| `POST /api/enquiries` | public, rate-limited | Submit contact form |
| `GET /api/enquiries` | admin (JWT) | List enquiries (paginated) |
| `PATCH /api/enquiries/{id}` | admin | Update status |
| `POST /api/quotes` | public, rate-limited | Submit RFQ with BOQ upload (multipart) |
| `GET /api/quotes` | admin | List quotes |
| `GET /api/quotes/{id}/boq` | admin | Download BOQ file (presigned S3 URL in prod) |
| `GET /api/products` | public | Filter by `category`, `q` (search), pagination |
| `GET /api/products/{slug}` | public | Product detail |
| `GET /api/categories` | public | All categories |
| `POST /api/admin/login` | public | Returns JWT |
| `GET /api/admin/me` | admin | Current admin |
| `GET /health` | public | Liveness probe for AWS |

---

## 6. Database tables

- `enquiries` — already implemented in starter
- `quotes` (id, name, phone, email, project_details, site_location, boq_file_url, timeline, status, created_at)
- `categories` (id, name, slug, image_url, sort_order)
- `products` (id, name, slug, category_id FK, brand, unit, description, image_url, is_active, created_at)
- `admin_users` (id, email, password_hash, created_at)

Seed data: ~5 categories, ~15 products, 1 admin user.

---

## 7. Repo layout (target)

```
civil-supplies/
├── PROJECT_BRIEF.md              ← this file
├── backend/                       ← FastAPI (starter already exists)
│   ├── app/
│   ├── alembic/                  ← add when schema stabilizes
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/                      ← Next.js (to build)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── .env.local.example
├── docker-compose.yml             ← runs frontend + backend + postgres
├── infra/                         ← AWS deploy (terraform or scripts)
│   └── README.md
└── README.md
```

---

## 8. Current state (when handoff starts)

The `backend/` folder already contains a working FastAPI starter with:
- `POST /api/enquiries` (validated, saves to DB, emails owner in background)
- `GET /api/enquiries` (temporary, **must be protected** with JWT in Phase 2)
- SQLite default, Postgres-ready via `DATABASE_URL`
- CORS for `localhost:3000`
- slowapi rate limiting
- `app/config.py`, `app/database.py`, `app/models.py`, `app/schemas.py`, `app/email_service.py`, `app/routers/enquiries.py`, `app/main.py`
- `requirements.txt`, `.env.example`, `README.md`

Everything else needs to be built.

---

## 9. Coding standards

- **Python:** type hints everywhere, Pydantic v2 syntax (`field_validator`, `model_config`), no `from typing import Optional` style — use `str | None`. Black-formatted.
- **TypeScript:** strict mode on, no `any`, prefer `type` over `interface` for unions, server components by default in Next.js App Router, mark `'use client'` only when needed.
- **Forms:** always react-hook-form + zod. Always show inline errors and a global success/error toast.
- **API client:** one `lib/api.ts` with a `fetcher()` that handles base URL, JSON, and errors. Don't sprinkle `fetch` everywhere.
- **Secrets:** never commit. `.env.example` only.
- **Commits:** conventional commits (`feat:`, `fix:`, `chore:`).

---

## 10. Out of scope (do not build)

- Public-facing pricing or shopping cart (this is a quote-only B2B site)
- User accounts for customers (only one admin login)
- Payment integration
- Multi-language / i18n
- SEO blog / CMS (can be added later)
