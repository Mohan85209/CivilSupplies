from fastapi.testclient import TestClient


def test_create_enquiry(client: TestClient):
    payload = {
        "name": "Ramesh Builders",
        "phone": "+91 98765 43210",
        "email": "ramesh@example.com",
        "city": "Hyderabad",
        "project_type": "Residential",
        "materials": ["OPC 53 Cement", "TMT Fe 500"],
        "quantity": "200 bags",
        "message": "Need quote for villa.",
    }
    resp = client.post("/api/enquiries", json=payload)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["success"] is True
    assert body["enquiry_id"] >= 1


def test_create_enquiry_validates_phone(client: TestClient):
    resp = client.post(
        "/api/enquiries",
        json={"name": "X", "phone": "1", "email": "x@y.com"},
    )
    assert resp.status_code == 422


def test_list_enquiries_requires_admin(client: TestClient):
    resp = client.get("/api/enquiries")
    assert resp.status_code == 401


def test_list_enquiries_with_admin(client: TestClient, admin_token: str):
    resp = client.get("/api/enquiries", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
