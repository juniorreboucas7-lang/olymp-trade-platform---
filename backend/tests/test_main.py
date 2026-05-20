import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to 2F Consultoria API"}

def test_auth_register():
    # Randomize username to avoid conflicts if db persists
    import random
    import string
    username = ''.join(random.choices(string.ascii_lowercase, k=8))
    response = client.post("/auth/register", json={
        "username": username,
        "email": f"{username}@example.com",
        "password": "testpassword",
        "role": "Admin"
    })
    assert response.status_code == 201
    assert response.json() == {"message": "User created successfully"}
