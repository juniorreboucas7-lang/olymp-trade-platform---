import requests

BASE_URL = "http://localhost:8000"

def test_services():
    # Login to get token
    login_data = {"username": "admin", "password": "password123"}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # Get current user id
    me_resp = requests.get(f"{BASE_URL}/users/me", headers=headers)
    user_id = me_resp.json().get("id")

    # Create a client
    client_data = {"name": "Cliente Serviço", "cpf_cnpj": "111.111.111-11"}
    client_id = requests.post(f"{BASE_URL}/clients/", json=client_data, headers=headers).json().get("id")

    # Create a property
    prop_data = {"name": "Sítio Teste", "total_area": 10.0, "city": "Santarém", "owner_id": client_id}
    prop_id = requests.post(f"{BASE_URL}/properties/", json=prop_data, headers=headers).json().get("id")

    # Create service
    service_data = {
        "service_type": "Georreferenciamento",
        "status": "Em andamento",
        "value": 5000.0,
        "costs": 1000.0,
        "profit": 4000.0,
        "client_id": client_id,
        "property_id": prop_id,
        "responsible_id": user_id
    }
    response = requests.post(f"{BASE_URL}/services/", json=service_data, headers=headers)
    print("Create Service:", response.status_code, response.json())
    service_id = response.json().get("id")

    # List services
    response = requests.get(f"{BASE_URL}/services/", headers=headers)
    print("List Services:", response.status_code, len(response.json()))

    # Delete service
    response = requests.delete(f"{BASE_URL}/services/{service_id}", headers=headers)
    print("Delete Service:", response.status_code)

if __name__ == "__main__":
    import time
    time.sleep(2)
    test_services()
