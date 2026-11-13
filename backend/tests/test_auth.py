import uuid
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_register_and_login_flow():
    unique_email = f"jane_{uuid.uuid4().hex[:8]}@cognexa-enterprise.com"
    # 1. Register
    reg_payload = {
        "name": "Jane Compliance",
        "email": unique_email,
        "organisation_name": "Cognexa Global",
        "password": "SecurePassword2026!"
    }
    r = client.post("/api/auth/register", json=reg_payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data
    assert data["user"]["email"] == unique_email
    token = data["access_token"]

    # 2. Check /me with bearer token
    r_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r_me.status_code == 200
    assert r_me.json()["email"] == unique_email

    # 3. Duplicate registration should fail
    r_dup = client.post("/api/auth/register", json=reg_payload)
    assert r_dup.status_code == 400

    # 4. Login with valid credentials
    login_payload = {
        "email": unique_email,
        "password": "SecurePassword2026!"
    }
    r_login = client.post("/api/auth/login", json=login_payload)
    assert r_login.status_code == 200
    assert "access_token" in r_login.json()

    # 5. Login with invalid password
    r_bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "WrongPassword!"
    })
    assert r_bad_login.status_code == 401

def test_forgot_and_reset_password_flow():
    unique_email = f"alex_{uuid.uuid4().hex[:8]}@cognexa.com"
    # Register first
    client.post("/api/auth/register", json={
        "name": "Alex Reviewer",
        "email": unique_email,
        "organisation_name": "Cognexa Reviews",
        "password": "SecurePassword2026!"
    })
    
    # 1. Forgot password
    r_forgot = client.post("/api/auth/forgot-password", json={"email": unique_email})
    assert r_forgot.status_code == 200
    reset_token = r_forgot.json().get("reset_token")
    assert reset_token is not None

    # 2. Reset password
    r_reset = client.post("/api/auth/reset-password", json={
        "token": reset_token,
        "new_password": "BrandNewPassword2026!"
    })
    assert r_reset.status_code == 200
    assert r_reset.json()["status"] == "password_reset_success"

    # 3. Login with old password fails
    r_old = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "SecurePassword2026!"
    })
    assert r_old.status_code == 401

    # 4. Login with new password succeeds
    r_new = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "BrandNewPassword2026!"
    })
    assert r_new.status_code == 200
