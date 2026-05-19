"""Pytest fixtures: isolated in-memory SQLite per test session, override get_db."""
from __future__ import annotations

import os
import tempfile
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Force a clean test DB and predictable secret/admin password BEFORE importing app modules.
_tmpdir = tempfile.mkdtemp(prefix="civil-supplies-test-")
os.environ["DATABASE_URL"] = f"sqlite:///{_tmpdir}/test.db"
os.environ["UPLOAD_DIR"] = f"{_tmpdir}/uploads"
os.environ["SECRET_KEY"] = "test-secret-key-do-not-use-in-prod"
os.environ["SEED_ADMIN_EMAIL"] = "admin@test.local"
os.environ["SEED_ADMIN_PASSWORD"] = "TestPass123!"
os.environ["AWS_S3_BUCKET"] = ""  # force local storage in tests

from app.auth import hash_password  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models import AdminUser, Category, Product  # noqa: E402


test_engine = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def _override_get_db() -> Generator:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(scope="session", autouse=True)
def _create_schema() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=test_engine)
    # Seed a minimum dataset.
    db = TestingSessionLocal()
    try:
        db.add(AdminUser(
            email=os.environ["SEED_ADMIN_EMAIL"],
            password_hash=hash_password(os.environ["SEED_ADMIN_PASSWORD"]),
        ))
        cement = Category(name="Cement", slug="cement", sort_order=1)
        steel = Category(name="TMT Steel", slug="tmt-steel", sort_order=2)
        db.add(cement)
        db.add(steel)
        db.flush()
        db.add(Product(name="OPC 53", slug="opc-53", category_id=cement.id,
                       brand="UltraTech", unit="50 kg bag", description="Strong cement", is_active=True))
        db.add(Product(name="PPC", slug="ppc", category_id=cement.id,
                       brand="Ambuja", unit="50 kg bag", description="Durable cement", is_active=True))
        db.add(Product(name="TMT Fe 500 12mm", slug="tmt-fe500-12mm", category_id=steel.id,
                       brand="TATA", unit="ton", description="Reinforcement steel", is_active=True))
        db.commit()
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture()
def admin_token(client: TestClient) -> str:
    resp = client.post(
        "/api/admin/login",
        json={"email": os.environ["SEED_ADMIN_EMAIL"], "password": os.environ["SEED_ADMIN_PASSWORD"]},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]
