import os

from fastapi.testclient import TestClient


def test_admin_login_success(client: TestClient):
    resp = client.post(
        "/api/admin/login",
        json={
            "email": os.environ["SEED_ADMIN_EMAIL"],
            "password": os.environ["SEED_ADMIN_PASSWORD"],
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["expires_in"] > 0


def test_admin_login_bad_password(client: TestClient):
    resp = client.post(
        "/api/admin/login",
        json={"email": os.environ["SEED_ADMIN_EMAIL"], "password": "wrong"},
    )
    assert resp.status_code == 401


def test_admin_me_requires_token(client: TestClient):
    resp = client.get("/api/admin/me")
    assert resp.status_code == 401


def test_admin_me_with_token(client: TestClient, admin_token: str):
    resp = client.get("/api/admin/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == os.environ["SEED_ADMIN_EMAIL"]
