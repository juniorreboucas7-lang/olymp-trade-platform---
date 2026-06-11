import requests

BASE_URL = "http://localhost:8000"

def test_properties():
    # Login to get token
    login_data = {"username": "admin", "password": "password123"}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # Create a client first
    client_data = {
        "name": "Fazendeiro Teste",
        "cpf_cnpj": "000.000.000-00",
        "city": "Santarém",
        "state": "PA"
    }
    client_resp = requests.post(f"{BASE_URL}/clients/", json=client_data, headers=headers)
    client_id = client_resp.json().get("id")

    # Create property
    prop_data = {
        "name": "Fazenda Esperança",
        "total_area": 500.5,
        "city": "Santarém",
        "ccir": "123456789",
        "owner_id": client_id
    }
    response = requests.post(f"{BASE_URL}/properties/", json=prop_data, headers=headers)
    print("Create Property:", response.status_code, response.json())
    prop_id = response.json().get("id")

    # List properties
    response = requests.get(f"{BASE_URL}/properties/", headers=headers)
    print("List Properties:", response.status_code, len(response.json()))

    # Update property
    prop_data["name"] = "Fazenda Nova Esperança"
    response = requests.put(f"{BASE_URL}/properties/{prop_id}", json=prop_data, headers=headers)
    print("Update Property:", response.status_code, response.json().get("name"))

    # Delete property
    response = requests.delete(f"{BASE_URL}/properties/{prop_id}", headers=headers)
    print("Delete Property:", response.status_code)

if __name__ == "__main__":
    import time
    time.sleep(2)
    test_properties()
