import requests

BASE_URL = "http://localhost:8000"

def test_auth():
    # 1. Create a user
    user_data = {
        "username": "admin",
        "password": "password123",
        "full_name": "Administrator",
        "role": "Admin"
    }
    response = requests.post(f"{BASE_URL}/users", json=user_data)
    print("Create User Response:", response.status_code, response.json())

    # 2. Login
    login_data = {
        "username": "admin",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    print("Login Response:", response.status_code)
    token = response.json().get("access_token")

    if token:
        # 3. Access protected route
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print("Get Me Response:", response.status_code, response.json())
    else:
        print("Failed to get token")

if __name__ == "__main__":
    import time
    time.sleep(2) # Wait for server to start
    test_auth()
