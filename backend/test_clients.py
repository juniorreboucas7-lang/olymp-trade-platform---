import requests

BASE_URL = "http://localhost:8000"

def test_clients():
    # Login to get token
    login_data = {"username": "admin", "password": "password123"}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # Create client
    client_data = {
        "name": "João da Silva",
        "cpf_cnpj": "123.456.789-00",
        "email": "joao@example.com",
        "phone": "(93) 99999-9999",
        "city": "Santarém",
        "state": "PA"
    }
    response = requests.post(f"{BASE_URL}/clients/", json=client_data, headers=headers)
    print("Create Client:", response.status_code, response.json())
    client_id = response.json().get("id")

    # Get clients
    response = requests.get(f"{BASE_URL}/clients/", headers=headers)
    print("List Clients:", response.status_code, len(response.json()))

    # Update client
    client_data["city"] = "Belterra"
    response = requests.put(f"{BASE_URL}/clients/{client_id}", json=client_data, headers=headers)
    print("Update Client:", response.status_code, response.json().get("city"))

    # Delete client
    response = requests.delete(f"{BASE_URL}/clients/{client_id}", headers=headers)
    print("Delete Client:", response.status_code)

if __name__ == "__main__":
    import time
    time.sleep(2)
    test_clients()
