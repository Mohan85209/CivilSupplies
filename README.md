# Civil Supplies

Monorepo for the Civil Engineering Supplies B2B portal — quote-only catalog, enquiries, RFQs with BOQ uploads, and an admin operations panel.

The product brief lives in [PROJECT_BRIEF.md](./PROJECT_BRIEF.md). The tech stack has been migrated to **Angular + Spring Boot + PostgreSQL**.

## Tech stack

**Frontend**
- Angular 17 (standalone components, signals, control-flow syntax)
- TypeScript (strict mode)
- Angular Material + responsive CSS (Flexbox / Grid)
- RxJS for HTTP / async state
- Karma + Jasmine for tests

**Backend**
- Java 17 + Spring Boot 3.2
- Spring MVC (REST)
- Spring Data JPA / Hibernate
- Spring Security with JWT (HS256) + RBAC (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_VIEWER`)
- Flyway migrations
- Bucket4j rate limiting
- JavaMailSender for email
- JUnit 5 + Mockito + Spring Boot Test

**Database**: PostgreSQL 16 (H2 in dev profile for fast local startup)

**DevOps**: Docker (multi-stage), docker-compose, Nginx reverse proxy, GitHub Actions CI/CD, Dependabot

**Monitoring**: Spring Boot Actuator → Prometheus / Grafana

**Cloud (AWS-ready)**: ECS / Fargate (containers), RDS (PostgreSQL), S3 (BOQ uploads), CloudFront (frontend CDN), ALB (load balancing), CloudWatch (logs)

## Layout

```
civil-supplies/
├── PROJECT_BRIEF.md            product brief
├── backend/                     Spring Boot REST API
│   ├── src/main/java/in/civilsupplies/api/
│   │   ├── category/  product/  enquiry/  quote/  user/  newsletter/
│   │   ├── security/  config/   exception/  common/  storage/  email/
│   │   └── CivilSuppliesApiApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/        Flyway SQL
│   ├── src/test/java/           JUnit 5 + Mockito + Spring Boot Test
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
├── frontend/                    Angular 17 SPA
│   ├── src/app/
│   │   ├── core/                services, interceptors, guards, models
│   │   ├── shared/              reusable UI components
│   │   ├── features/            lazy-loaded route components
│   │   └── app.*.ts
│   ├── src/styles.css           design tokens (palette, typography)
│   ├── src/environments/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── angular.json / package.json
│   └── README.md
├── docker-compose.yml           postgres + redis + backend + frontend
├── Makefile                     up / down / test / lint / build / clean
├── .github/workflows/           ci.yml, docker-publish.yml
├── .env.example
└── README.md                    this file
```

## Quick start (Docker)

```bash
cp .env.example .env
make up
```

Then open:
- Frontend: http://localhost
- Backend health: http://localhost:8080/health
- Swagger UI: http://localhost:8080/swagger-ui.html
- Prometheus metrics: http://localhost:8080/actuator/prometheus

Default admin (dev only — change in production!):
- email: `admin@civilsupplies.in`
- password: `ChangeMe123!`

## Quick start (local, without Docker)

```bash
# Backend (uses H2 in dev profile)
cd backend && mvn spring-boot:run

# Frontend (separate terminal)
cd frontend && npm install && npm start
```

Frontend serves on `http://localhost:4200`, backend on `http://localhost:8080`.

## Features

### Customer-facing
- Home with hero, category grid, featured products, testimonials, CTAs
- Product catalog with category filter, full-text search, sort, pagination
- Product detail page with specs, ratings, wishlist
- Services overview with process walkthrough
- About page with timeline and certifications
- Contact form with materials multi-select + global rate limiting
- Multi-step quote (RFQ) form with BOQ file upload (PDF/Excel/CSV/image, max 10 MB)
- Wishlist (localStorage) with bulk quote action
- Newsletter subscription (footer)
- Floating WhatsApp button + sticky "Get Quote" CTA
- Dark mode toggle (system-preference aware)
- Responsive design (Flexbox / Grid)

### Admin
- Email/password login → JWT (access + refresh) with route guards
- Dashboard with KPIs and recent activity
- Enquiries: paginated table with status workflow (NEW → CONTACTED → CLOSED → SPAM)
- Quotes: paginated table with status pipeline + BOQ file download
- Products: catalog overview
- Users: list + create (ROLE_ADMIN only) with role assignment

## Common tasks

| Command            | Description                                |
|--------------------|--------------------------------------------|
| `make up`          | Bring up the full stack via docker-compose |
| `make down`        | Tear it down                               |
| `make logs`        | Tail all container logs                    |
| `make build`       | Build both frontend and backend artifacts  |
| `make test`        | Run all tests (backend + frontend)         |
| `make lint`        | Lint both apps                             |
| `make clean`       | Remove build artifacts                     |

## Security

- All public-facing endpoints (enquiries, quotes, newsletter) are rate-limited per IP via Bucket4j.
- Authentication uses JWT with separate access (60 min) and refresh (7 day) tokens.
- BCrypt strength 12 for password hashing.
- CORS limited to configured origins.
- Security headers via Nginx (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- BOQ uploads validated by content type and size.
- See [SECURITY.md](./SECURITY.md) for the disclosure policy.

## Deployment (AWS)

The Docker images produced by `docker-publish.yml` can be deployed to:

- **ECS / Fargate** or **Elastic Beanstalk** (backend container)
- **S3 + CloudFront** (frontend static assets) or a separate ECS service running the Nginx image
- **Amazon RDS for PostgreSQL** (managed DB)
- **AWS SES** for email (point `SMTP_*` env vars at the SES SMTP endpoint)
- **CloudWatch Logs** for log aggregation
- **ALB** in front for TLS termination and routing
- **IAM** roles for service permissions; never embed credentials in images

The frontend's nginx config already proxies `/api` and `/files` to `backend:8080`, so the only deployment glue needed is correct DNS / load-balancer routing and an RDS endpoint via `DATABASE_URL`.

## License

Proprietary. Contact the owner for usage rights.
