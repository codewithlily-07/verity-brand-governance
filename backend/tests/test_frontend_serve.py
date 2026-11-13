from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_frontend_spa_serving():
    res = client.get("/")
    assert res.status_code == 200
    assert "<!DOCTYPE html>" in res.text
    assert "VERITY" in res.text
