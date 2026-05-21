-- Initial schema for Civil Supplies B2B portal

CREATE TABLE categories (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(120) NOT NULL UNIQUE,
    slug         VARCHAR(140) NOT NULL UNIQUE,
    image_url    VARCHAR(500),
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL,
    updated_at   TIMESTAMPTZ
);

CREATE TABLE products (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(160) NOT NULL,
    slug         VARCHAR(180) NOT NULL UNIQUE,
    category_id  BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand        VARCHAR(120),
    unit         VARCHAR(40),
    description  TEXT,
    image_url    VARCHAR(500),
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    rating       NUMERIC(3,1),
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL,
    updated_at   TIMESTAMPTZ
);
CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE enquiries (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(120) NOT NULL,
    phone        VARCHAR(20)  NOT NULL,
    email        VARCHAR(160) NOT NULL,
    city         VARCHAR(80),
    project_type VARCHAR(40),
    materials    JSONB,
    quantity     VARCHAR(120),
    message      TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at   TIMESTAMPTZ NOT NULL,
    updated_at   TIMESTAMPTZ
);
CREATE INDEX idx_enquiries_email  ON enquiries(email);
CREATE INDEX idx_enquiries_phone  ON enquiries(phone);
CREATE INDEX idx_enquiries_status ON enquiries(status);

CREATE TABLE quotes (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    phone           VARCHAR(20)  NOT NULL,
    email           VARCHAR(160) NOT NULL,
    project_details TEXT,
    site_location   VARCHAR(200),
    timeline        VARCHAR(120),
    boq_filename    VARCHAR(255),
    boq_file_url    VARCHAR(500),
    status          VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ
);
CREATE INDEX idx_quotes_email  ON quotes(email);
CREATE INDEX idx_quotes_status ON quotes(status);

CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(160),
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL,
    updated_at    TIMESTAMPTZ
);

CREATE TABLE admin_user_roles (
    user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    role    VARCHAR(32) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE newsletter_subscribers (
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(160) NOT NULL UNIQUE,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);
