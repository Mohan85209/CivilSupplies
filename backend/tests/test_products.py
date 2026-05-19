from fastapi.testclient import TestClient


def test_list_categories(client: TestClient):
    resp = client.get("/api/categories")
    assert resp.status_code == 200
    items = resp.json()
    slugs = {c["slug"] for c in items}
    assert {"cement", "tmt-steel"}.issubset(slugs)


def test_list_products_no_filter(client: TestClient):
    resp = client.get("/api/products")
    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] >= 3
    assert body["page"] == 1


def test_list_products_filtered_by_category(client: TestClient):
    resp = client.get("/api/products?category=cement")
    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] == 2
    for item in body["items"]:
        assert "Cement" in item["name"] or item["brand"] in {"UltraTech", "Ambuja"}


def test_list_products_search(client: TestClient):
    resp = client.get("/api/products?q=TATA")
    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] == 1
    assert body["items"][0]["slug"] == "tmt-fe500-12mm"


def test_product_detail(client: TestClient):
    resp = client.get("/api/products/opc-53")
    assert resp.status_code == 200
    assert resp.json()["slug"] == "opc-53"


def test_product_detail_404(client: TestClient):
    resp = client.get("/api/products/does-not-exist")
    assert resp.status_code == 404
