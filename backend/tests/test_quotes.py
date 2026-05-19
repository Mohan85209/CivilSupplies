import io

from fastapi.testclient import TestClient


def _form_fields():
    return {
        "name": "ABC Constructions",
        "phone": "+91 98765 43210",
        "email": "abc@example.com",
        "project_details": "Need bulk OPC 53 + TMT for a 5-story building.",
        "site_location": "Kondapur, Hyderabad",
        "timeline": "Q3 2026",
    }


def test_quote_upload_pdf_accepted(client: TestClient):
    files = {"boq_file": ("boq.pdf", io.BytesIO(b"%PDF-1.4 fake content"), "application/pdf")}
    resp = client.post("/api/quotes", data=_form_fields(), files=files)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["success"] is True
    assert body["quote_id"] >= 1


def test_quote_upload_exe_rejected(client: TestClient):
    files = {"boq_file": ("malware.exe", io.BytesIO(b"MZ\x90\x00"), "application/octet-stream")}
    resp = client.post("/api/quotes", data=_form_fields(), files=files)
    assert resp.status_code == 400
    assert "PDF" in resp.json()["detail"]


def test_quote_without_file_allowed(client: TestClient):
    resp = client.post("/api/quotes", data=_form_fields())
    assert resp.status_code == 201


def test_list_quotes_requires_admin(client: TestClient):
    resp = client.get("/api/quotes")
    assert resp.status_code == 401


def test_list_quotes_with_admin(client: TestClient, admin_token: str):
    resp = client.get("/api/quotes", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
