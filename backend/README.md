# Civil Supplies — Spring Boot Backend

Spring Boot 3.2 REST API for the Civil Supplies B2B portal.

## Stack

- **Java 17 + Spring Boot 3.2**
- **Spring MVC** (REST controllers)
- **Spring Data JPA / Hibernate**
- **PostgreSQL** (prod) / **H2** (dev)
- **Flyway** migrations
- **Spring Security + JWT** (HS256) with **RBAC** (ROLE_ADMIN / ROLE_STAFF / ROLE_VIEWER)
- **Bucket4j** rate limiting for public endpoints
- **JavaMailSender** (SMTP) for admin notifications
- **Springdoc OpenAPI** at `/swagger-ui.html`
- **Micrometer + Prometheus** at `/actuator/prometheus`

## Quick start (dev profile, H2 in-memory)

```bash
./mvnw spring-boot:run
# or
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The default admin login is seeded on first run:

- Email: `admin@civilsupplies.in`
- Password: `ChangeMe123!`

Change it via `POST /api/admin/users` (ROLE_ADMIN) and disable the seeded account in production.

## Build

```bash
mvn clean package -DskipTests
java -jar target/civilsupplies-api.jar
```

## Test

```bash
mvn test
```

## Endpoints (summary)

| Method | Path                       | Auth         | Notes                     |
|--------|----------------------------|--------------|---------------------------|
| GET    | /api/products              | public       | filter: category, q       |
| GET    | /api/products/{slug}       | public       |                           |
| GET    | /api/categories            | public       |                           |
| POST   | /api/enquiries             | public, RL   | rate-limited              |
| GET    | /api/enquiries             | auth         | paginated                 |
| PATCH  | /api/enquiries/{id}        | ADMIN/STAFF  | status update             |
| POST   | /api/quotes                | public, RL   | multipart with BOQ file   |
| GET    | /api/quotes                | auth         |                           |
| PATCH  | /api/quotes/{id}           | ADMIN/STAFF  |                           |
| GET    | /api/quotes/{id}/boq       | auth         | returns URL               |
| POST   | /api/newsletter/subscribe  | public, RL   |                           |
| POST   | /api/admin/login           | public       | returns JWT + refresh     |
| POST   | /api/admin/refresh         | public       |                           |
| GET    | /api/admin/me              | auth         |                           |
| GET    | /api/admin/users           | ADMIN/STAFF  |                           |
| POST   | /api/admin/users           | ADMIN        |                           |
| GET    | /health                    | public       |                           |

## Environment variables

See `.env.example` at the repo root. Notable ones:

| Var            | Purpose                          |
|----------------|----------------------------------|
| DATABASE_URL   | JDBC URL (PostgreSQL in prod)    |
| JWT_SECRET     | HMAC secret (>= 32 bytes)        |
| SMTP_HOST/USER/PASS | Mail server credentials     |
| UPLOAD_DIR     | BOQ upload directory             |
| CORS_ORIGINS   | Comma-separated allowed origins  |
| APP_PROFILE    | dev / prod                       |
