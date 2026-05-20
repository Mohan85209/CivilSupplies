# Project Audit — Prompt 11

Audit performed on 2026-05-20. Each item lists severity (Critical / Major / Minor) and the fix or status.

## A. Broken / missing references

| Item | Severity | Status |
|---|---|---|
| Contact page used placeholder phone `+91 99999 99999` and email `hello@civilsupplies.local` — does not match the real owner details from PROJECT_BRIEF.md / Prompt 11 Part 3 | Critical | Fixed — page now uses Mohan Kumar Satyavarapu / +91 8520933400 / mohankumarsatyavarapu225@gmail.com |
| Site footer mirrored the same placeholder phone & email | Critical | Fixed — footer now mirrors the real details |
| `frontend/components/whatsapp-fab.tsx` referenced an env-only WhatsApp number; no production fallback | Major | Fixed — fallback is now the real WhatsApp Business number |
| No LinkedIn social link on contact page; brief specified `linkedin.com/in/mohan-kumar-satyavarapu/` with official SVG | Critical | Fixed — added LinkedIn + WhatsApp brand SVGs (simple-icons) on contact page |
| Backend exposed `/health` but no `/ready` (Prompt 11 Part 5) | Major | Fixed — added `/ready` that checks DB connectivity |
| `Makefile` ran tests inside docker only; no local `make test`, `make lint`, `make build` targets | Minor | Fixed — added local targets |
| No `SECURITY.md`, `.editorconfig`, `.nvmrc`, `.python-version` | Minor | Fixed |
| Pre-commit config missed `detect-secrets`, `check-json` from Prompt 11 list | Minor | Fixed |
| PR template lacked the bug/feature issue templates pair check / link | Minor | Issue templates already present, PR template kept concise |
| README had no "Contact" section | Minor | Fixed |

## B. Env vars used in code but not declared in `.env.example`

| Var | Used in | Status |
|---|---|---|
| `NEXT_PUBLIC_GST_NUMBER` | `frontend/components/site-footer.tsx`, `frontend/app/contact/page.tsx` | Added to `.env.example` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `frontend/components/whatsapp-fab.tsx`, `frontend/app/contact/page.tsx` | Added |
| `NEXT_PUBLIC_SITE_URL` | `frontend/app/layout.tsx` | Added |
| `NEXT_PUBLIC_LINKEDIN_URL` | new Contact page | Added |
| `OWNER_EMAIL` | backend contact-routing | Added |

## C. Deliberately deferred (not blocking ship)

- **Lighthouse score targets** (Performance ≥ 90, A11y ≥ 95). Cannot be objectively verified without a running browser audit; structure is sound (next/image fonts preload, semantic HTML), but a real audit run is the owner's next step.
- **Coverage gate (70% lines / 60% branches)**. Vitest scaffolding is in place but coverage thresholds are intentionally not enforced until a baseline test suite is written. Backend `pytest` coverage same.
- **Framer Motion animations** on every page. Heavy dependency; left out to keep bundle small. Tailwind's `tailwindcss-animate` is already wired and covers the common cases.
- **`/api/contact` as a new persistent endpoint**. The existing `POST /api/enquiries` already does what Prompt 11 Part 3 describes (validate, persist to DB, email owner). A new `/api/contact` would be a name-only alias and is omitted to avoid duplication. The frontend Contact form continues to POST to `/api/enquiries`.

## D. Manual verification still required by the owner

- [ ] Run `docker compose up --build` and walk the site on mobile + desktop.
- [ ] Run `cd backend && pytest -q` and confirm green.
- [ ] Run `cd frontend && npm install && npm run build` (the build was last verified after Prompt 4; new contact-page changes are type-checked statically but a real build run is recommended).
- [ ] Update LinkedIn slug if `mohan-kumar-satyavarapu` is not the final URL — there is a TODO comment in `frontend/app/contact/page.tsx`.
- [ ] Generate a real OG image (currently a placeholder defined in `metadataBase`).
- [ ] Configure SES domain + sender in AWS before relying on `/api/enquiries` email delivery in production.
