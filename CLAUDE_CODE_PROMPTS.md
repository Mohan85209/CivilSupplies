# Claude Code Prompts — Civil Supplies Website

Paste these prompts into Claude Code **one at a time, in order**. After each prompt, review what Claude Code produced, test it, commit it, then move to the next.

**Before you start, see `CLAUDE_CODE_SETUP.md` for installation and the first session.**

---

## Prompt 0 — Onboarding (run once when you start a new Claude Code session)

```
Read PROJECT_BRIEF.md at the repo root. That file is the source of truth for this project — its tech stack, scope, design, endpoints, and coding standards. Acknowledge the brief in one sentence and tell me the current state of the repo (what folders exist, what's already built). Do not start coding yet.
```

---

## Prompt 1 — Restructure into monorepo

```
Right now the FastAPI starter sits at the repo root. Restructure into a monorepo:

- Move all current backend code into ./backend/
- Create ./frontend/ as an empty folder (we'll fill it next)
- Move .env.example and README.md inside backend/
- Update backend/README.md so the run instructions reflect the new path (cd backend && uvicorn app.main:app --reload)
- Add a root-level README.md that explains the monorepo layout and points to PROJECT_BRIEF.md
- Add a root-level .gitignore covering: venv/, __pycache__/, *.pyc, .env, *.db, uploads/, node_modules/, .next/, .DS_Store
- Initialize git if not already, and make an initial commit: "chore: restructure into monorepo"

Verify the backend still runs from ./backend/ before you finish.
```

---

## Prompt 2 — Extend backend: products, categories, quotes, JWT admin auth

```
Extend the FastAPI backend per PROJECT_BRIEF.md sections 5 and 6. Build incrementally and keep the existing enquiries endpoint working.

Add these models in backend/app/models.py: Category, Product, Quote, AdminUser. Use SQLAlchemy 2.x typed syntax (Mapped[...], mapped_column). Add slugs with indexes. Include sensible foreign keys and back-populates.

Add Pydantic v2 schemas in backend/app/schemas.py for all new models.

Add these routers:
- backend/app/routers/products.py — GET /api/products (filters: category slug, q search, pagination), GET /api/products/{slug}
- backend/app/routers/categories.py — GET /api/categories
- backend/app/routers/quotes.py — POST /api/quotes (multipart form, BOQ file upload to ./uploads/, validate type to pdf/xlsx/xls only, max 10MB), GET /api/quotes (admin), GET /api/quotes/{id}/boq (admin, returns file)
- backend/app/routers/admin.py — POST /api/admin/login (returns JWT), GET /api/admin/me

Create backend/app/auth.py with: password hashing via passlib[bcrypt], JWT signing with python-jose using a SECRET_KEY from settings, a get_current_admin FastAPI dependency.

Protect: GET /api/enquiries, PATCH /api/enquiries/{id}, GET /api/quotes, GET /api/quotes/{id}/boq with get_current_admin.

Add a seed script backend/scripts/seed.py that creates: 5 categories (Cement, TMT Steel, Bricks & Blocks, Aggregates, Tools & Safety), ~15 products across them, and 1 admin user (email=admin@civilsupplies.local, password from env SEED_ADMIN_PASSWORD or default "ChangeMe123!"). Make it idempotent.

Update requirements.txt for new deps (passlib[bcrypt], python-jose[cryptography], python-multipart).
Update .env.example with SECRET_KEY, JWT_EXPIRE_MINUTES=1440, SEED_ADMIN_PASSWORD, UPLOAD_DIR=./uploads.

Add backend/tests/ with pytest tests for: enquiry creation, admin login flow, product list with filter, quote upload accepting a PDF and rejecting a .exe.

After building, run the seed script and the tests. Commit as "feat(backend): products, quotes, JWT admin auth".
```

---

## Prompt 3 — Scaffold the Next.js frontend

```
Create the frontend per PROJECT_BRIEF.md sections 2, 3, 4.

Run create-next-app inside ./frontend/ with: TypeScript, Tailwind, App Router, src/ dir = no, import alias @/*, eslint yes. Then:

- Install: shadcn/ui (init with neutral base color, configure Tailwind for our palette), react-hook-form, zod, @hookform/resolvers, lucide-react, sonner (for toasts)
- Set up the brand palette in tailwind.config.ts as CSS variables: primary navy #0F2C5C, accent orange #F58220
- Create frontend/lib/api.ts — a typed fetcher() that reads process.env.NEXT_PUBLIC_API_URL, handles JSON + FormData, throws ApiError on non-2xx
- Create frontend/lib/types.ts with types matching the backend Pydantic schemas
- Create the shared layout: components/site-header.tsx (logo, nav, "Get Quote" CTA), components/site-footer.tsx (4-column footer with GST, address, social), components/whatsapp-fab.tsx (floating button bottom-right)
- Use shadcn components: Button, Input, Textarea, Select, Card, Toast/Sonner, Dialog

Stub all the pages from section 4 of the brief with placeholder content (just headings and "coming soon"). Real content comes in the next prompts.

Add frontend/.env.local.example with NEXT_PUBLIC_API_URL=http://localhost:8000.

Verify it builds (npm run build) and runs (npm run dev). Commit "feat(frontend): scaffold Next.js with shadcn and shared layout".
```

---

## Prompt 4 — Build the home, services, and about pages

```
Build content for / , /services, /about per section 4 of the brief.

Home page (/):
- Hero: H1 "Trusted Supplier of Civil Engineering Materials & Services", subhead, two CTAs (Request a Quote → /quote, Contact Us → /contact), background should feel construction/industrial without being a stock cliche
- Featured categories grid (fetch from GET /api/categories on the server, link each to /products?category=<slug>)
- Why Choose Us — 4 cards (Quality Assured, On-Time Delivery, Competitive Pricing, Expert Support) with lucide icons
- Services teaser — 3 most relevant services with link to /services
- Testimonials carousel (use 3 placeholder testimonials, easy to swap later)
- Final CTA band: "Have a project? Get a custom material plan." with button to /quote

/services: card grid of all 7 services from brief section 1, each with icon, 2-3 line description, "Enquire" button linking to /contact?service=<slug>

/about: prose page with sections — Our Story, Mission & Vision, Network (warehouses, fleet), Certifications (placeholder ISO/GST). Include the company GST number from env.

Use server components. Keep everything mobile-first. Run npm run build to catch type errors. Commit "feat(frontend): home, services, about pages".
```

---

## Prompt 5 — Build the contact and quote forms (the most important pages)

```
Build /contact and /quote with full validation and backend integration.

/contact page:
- Two-column layout (form left, info right on desktop; stacked on mobile)
- Form fields: name, phone, email, city, project_type (select: Residential/Commercial/Infrastructure/Industrial), materials (multi-select with checkboxes for: OPC Cement, PPC Cement, TMT Steel, Red Bricks, AAC Blocks, M-Sand, Aggregates, RMC, Construction Chemicals, Safety Gear), quantity, message
- Validation with zod (match backend EnquiryCreate constraints exactly)
- On submit: POST to /api/enquiries via lib/api.ts, show Sonner success toast with the returned message, reset form
- Right column: office address with embedded Google Maps iframe (use a placeholder address), phone (click-to-call), WhatsApp (wa.me link), email, business hours, GST number

/quote page:
- Form fields: name, phone, email, project_details (textarea), site_location, timeline (date picker or text), and a file input for BOQ accepting .pdf, .xlsx, .xls (max 10MB, validate client-side)
- Submit as multipart/form-data to /api/quotes
- Show progress while uploading
- Reassurance text under the form: "We respond within 24 hours"
- Below the form, a small "Recent projects served" strip with 4 placeholder logos

Both forms must be 'use client' components. Handle network errors gracefully (show error toast). Add loading state on submit button.

Run e2e check: fill form on running dev server, verify a row appears in the backend DB and an email log line is printed.

Commit "feat(frontend): contact and quote forms wired to API".
```

---

## Prompt 6 — Build the product catalog and detail pages

```
Build /products and /products/[slug].

/products:
- Server component that reads searchParams (category, q, page)
- Fetches GET /api/categories and GET /api/products?category=...&q=...&page=...
- Layout: sidebar with category filter (links that update searchParams), main area with search input (client component, debounced, updates URL), grid of product cards
- Card: image (use next/image with placeholder), name, brand, unit, short description, "Request Quote" button that links to /quote?product=<slug>
- Empty state and pagination

/products/[slug]:
- generateStaticParams from GET /api/products (best-effort), but use dynamic = 'force-dynamic' if simpler for now
- Layout: large image left, details right (name, brand, unit, full description, "Request Quote" CTA), related products from same category at the bottom

Make sure SEO basics are set: page <title>, <meta description>, OpenGraph tags via Next metadata API.

Commit "feat(frontend): product catalog and detail pages".
```

---

## Prompt 7 — Build the admin panel

```
Build /admin and /admin/dashboard.

/admin:
- Simple email + password form
- On submit, POST to /api/admin/login, store the JWT in an httpOnly cookie via a Next.js Route Handler (POST /api/auth/login that proxies to backend and sets cookie) — do NOT store JWT in localStorage
- Redirect to /admin/dashboard on success

/admin/dashboard:
- Server component, reads JWT from cookie, calls backend with Authorization header. If 401, redirect to /admin
- Tabs: Enquiries / Quotes
- Enquiries tab: table with date, name, phone, email, city, project_type, status, actions (View opens a Dialog with full details + "Mark contacted/closed" buttons that PATCH /api/enquiries/{id})
- Quotes tab: same pattern, with a "Download BOQ" button that hits GET /api/quotes/{id}/boq via authed route handler
- Filter inputs: status dropdown, search box, date range
- "Logout" button clears the cookie

Use shadcn Table, Tabs, Dialog, Badge components. Commit "feat(frontend): admin panel with JWT cookie auth".
```

---

## Prompt 8 — Dockerize and add docker-compose

```
Containerize the project.

Create backend/Dockerfile: python:3.11-slim base, non-root user, copy requirements first then code, expose 8000, run uvicorn with --host 0.0.0.0.

Create frontend/Dockerfile: multi-stage (deps → builder → runner) using node:20-alpine, output standalone (configure next.config to output: 'standalone'), expose 3000.

Create docker-compose.yml at the repo root with three services:
- postgres (postgres:16-alpine, named volume for data, healthcheck)
- backend (build ./backend, depends_on postgres healthy, env from .env, port 8000, mount ./uploads volume)
- frontend (build ./frontend, depends_on backend, env NEXT_PUBLIC_API_URL=http://backend:8000, port 3000)

Add a root .env.example with all variables for compose.

Add a Makefile at the repo root with targets: up, down, logs, seed (runs seed.py inside backend container), test.

Verify everything starts with `make up`. Commit "chore: dockerize backend and frontend with compose".
```

---

## Prompt 9 — AWS deployment plan (matches Mohan's AWS learning path)

```
Create ./infra/ with an AWS deployment plan that matches our learning path (EC2, Lambda, EventBridge, S3, RDS, SES, boto3). Do NOT use Terraform for now — produce shell scripts + a detailed runbook so we learn each AWS service hands-on.

Deliverables in ./infra/:
- README.md — the runbook with step-by-step AWS Console + CLI commands for: creating a VPC, security groups, RDS Postgres (db.t3.micro), EC2 (t3.small Ubuntu 24, with a user-data script that installs Docker and starts the backend container), an S3 bucket for BOQ uploads, AWS SES sender verification, IAM role for EC2 to access S3 + SES + Secrets Manager, Application Load Balancer + ACM cert + Route53, and Amplify Hosting for the frontend.
- scripts/01_create_rds.sh, 02_launch_ec2.sh, 03_create_s3.sh, 04_setup_ses.sh — boto3 Python scripts (since we're learning boto3) that do the same thing programmatically.
- A Lambda + EventBridge daily digest: ./infra/lambda/digest/ with handler.py that connects to RDS, queries enquiries from the last 24h, formats an HTML email, sends via SES. Include a deploy.sh that zips and uploads it, plus the EventBridge rule (cron at 09:00 IST).
- A backend code change: switch file uploads from local disk to S3 when AWS_S3_BUCKET env var is set. Generate presigned URLs for admin download.

Commit "feat(infra): aws deployment runbook and lambda digest".
```

---

## Prompt 10 — Polish, SEO, analytics

```
Final polish pass:

- Add a sitemap.ts and robots.ts in the Next.js app/ folder
- Add a favicon, apple-touch-icon, OpenGraph default image
- Add JSON-LD structured data on the homepage (LocalBusiness type) with the business name, address, phone, geo
- Add Plausible or Google Analytics 4 (configurable via env, default off)
- Add a /privacy and /terms page with boilerplate content
- Make sure all images use next/image with proper alt text
- Run Lighthouse mentally: ensure no console errors, no layout shift, fonts preloaded, images sized
- Add an OG image generator using Next.js opengraph-image.tsx for the homepage

Commit "chore: seo, polish, legal pages".
```

---

## Prompt 11 — Audit, polish, contact page, tests, deployment & git automation

```
Do a complete project audit and finish the website so it's production-ready, end-user friendly, and eye-catchy. Work in this exact order and commit after each part.

PART 1 — AUDIT (find what's missing, broken, or skipped)
- Walk the entire repo and produce ./AUDIT.md listing:
  - Files referenced in code/imports/config but missing on disk (broken imports, missing assets, dead routes).
  - Env vars used in code but not declared in .env.example.
  - Failed/skipped tests, broken builds, lint errors, type errors, console errors in browser.
  - Unused files, dead code, leftover TODO/FIXME comments.
  - Missing standard project files: README.md, LICENSE, .gitignore, .gitattributes, .env.example, CONTRIBUTING.md, SECURITY.md, .editorconfig, .pre-commit-config.yaml, .nvmrc, .python-version.
- Fix EVERY item in AUDIT.md. One small focused commit per logical fix.

PART 2 — UI / UX POLISH (eye-catchy + user-friendly)
- Apply a clean design system: Inter or Poppins typography, a primary + accent color, soft shadows, rounded-2xl corners, consistent spacing scale.
- Smooth Framer Motion animations on page load, hover, and scroll-into-view.
- Sticky responsive navbar with mobile hamburger, hero with strong CTA, footer with quick links + socials.
- Loading skeletons on every data fetch, friendly empty states with illustrations, toast notifications (sonner or react-hot-toast), inline form validation.
- Accessibility: alt text on every image, aria-labels on icon buttons, full keyboard navigation, visible focus rings, color contrast >= WCAG AA.
- Responsive at mobile (<=380px), tablet, desktop. Verify in Chrome DevTools device toolbar.
- SEO + meta: <title>, meta description, Open Graph + Twitter tags, favicon, robots.txt, sitemap.xml.
- Lighthouse targets: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.

PART 3 — CONTACT PAGE (use these exact details)
Build or replace src/pages/Contact.* with:
- Name: Mohan Kumar Satyavarapu
- Phone: +91 8520933400  — render as a clickable tel:+918520933400 link
- Email: mohankumarsatyavarapu225@gmail.com  — clickable mailto: link
- WhatsApp Business button: official WhatsApp logo (inline SVG from simple-icons), opens https://wa.me/918520933400 in a new tab, aria-label "Chat on WhatsApp Business".
- LinkedIn button: official LinkedIn logo (inline SVG from simple-icons), opens https://www.linkedin.com/in/mohan-kumar-satyavarapu/ in a new tab. Leave a TODO comment to update the slug if different.
- Contact form: Name, Email, Phone, Message — POSTs to /api/contact, which stores the enquiry in Postgres and sends an SES email to the owner. Show success/error toast.
- Embed a Google Maps iframe centered on Hyderabad as a placeholder.
- Use ONLY official brand SVGs (simple-icons) — no raster logos, no random downloaded PNGs.
- Mirror the same contact details in the site footer.

PART 4 — UNIT + INTEGRATION TESTS
- Frontend: Vitest + React Testing Library. Cover at minimum — navbar render, route smoke tests, contact form validation, contact form submit success/failure, accessibility (axe).
- Backend: pytest. Cover at minimum — /api/contact happy path, validation errors, DB persistence, SES send (mocked), S3 upload (mocked with moto), auth on admin routes.
- Coverage gate: 70% lines, 60% branches. CI fails if below.
- Wire `npm test` and `pytest -q` into package.json scripts and a Makefile (make test, make lint, make build, make deploy).

PART 5 — DEPLOYMENT READINESS
- Multi-stage Dockerfile for backend, lightweight image for frontend. docker-compose.yml with backend + Postgres + frontend.
- Healthcheck endpoints: GET /health (liveness), GET /ready (verifies DB + S3 + SES reachable).
- Structured JSON logging with request IDs; React error boundary on frontend.
- Zero hardcoded secrets — everything from env. Document every key in .env.example with a comment.
- Update ./infra/README.md with final deploy steps and a "Day-2 ops" section: backups, log rotation, rollback procedure, on-call checklist.

PART 6 — GIT + AUTOMATION (catch everything I forgot)
- .gitignore: node_modules, __pycache__, .venv, .env*, dist, build, coverage, .DS_Store, .idea, .vscode, *.log.
- .gitattributes for consistent line endings.
- Conventional Commits enforced via commitlint + husky.
- pre-commit hooks: ruff + black (Python), eslint + prettier (JS/TS), detect-secrets, end-of-file-fixer, trailing-whitespace, check-yaml, check-json.
- .github/workflows/ci.yml — on every PR: install, lint, typecheck, test, build.
- .github/workflows/deploy.yml — on push to main: build Docker image, push to ECR, SSH to EC2 to pull + restart; deploy frontend to AWS Amplify.
- .github/dependabot.yml for npm + pip weekly updates.
- .github/pull_request_template.md plus bug + feature issue templates.
- CODEOWNERS with @mohankumarsatyavarapu as owner.
- CONTRIBUTING.md documenting branch protection: require PR review + green CI before merge to main.

PART 7 — FINAL VERIFICATION
- Re-run the AUDIT — AUDIT.md must come back clean.
- Run locally: `npm run build`, `npm test`, `pytest`, `docker compose up --build`. All green.
- Open the site, walk through every page on mobile + desktop. No console errors, no broken images, no 404s.
- Update README.md with: project overview, hero screenshot/GIF, tech stack badges, quickstart, env vars table, deploy section, and a Contact section using the exact details from Part 3.
- Final commit: "chore: production-ready polish, contact page, tests, ci/cd, deploy".
```

---

## How to use these prompts

1. Open Claude Code in your project folder.
2. Paste Prompt 0 first — make sure it acknowledges the brief.
3. Paste each subsequent prompt, **one at a time**.
4. After Claude Code finishes, manually run the build/tests it suggests. If something breaks, paste the error back into the same session — don't start a new one mid-feature.
5. Each prompt ends with a commit. Don't skip those; they let you roll back if needed.

## If you want to deviate

Anything you say beyond these prompts is fine — Claude Code will keep using PROJECT_BRIEF.md as context. To change scope (e.g. "actually I do want pricing on the site"), update PROJECT_BRIEF.md first, then ask for the change. That keeps future prompts coherent.
