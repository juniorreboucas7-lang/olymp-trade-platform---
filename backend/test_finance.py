import requests

BASE_URL = "http://localhost:8000"

def test_finance():
    # Login as admin
    login_data = {"username": "admin", "password": "password123"}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # Create income record
    income_data = {
        "type": "Entrada",
        "description": "Pagamento de Serviço",
        "amount": 5000.0,
        "category": "Serviços"
    }
    response = requests.post(f"{BASE_URL}/finance/records", json=income_data, headers=headers)
    print("Create Income:", response.status_code, response.json())

    # Create expense record
    expense_data = {
        "type": "Saída",
        "description": "Combustível",
        "amount": 200.0,
        "category": "Transporte"
    }
    response = requests.post(f"{BASE_URL}/finance/records", json=expense_data, headers=headers)
    print("Create Expense:", response.status_code, response.json())

    # Get summary
    response = requests.get(f"{BASE_URL}/finance/summary", headers=headers)
    print("Summary:", response.status_code, response.json())

if __name__ == "__main__":
    import time
    time.sleep(2)
    test_finance()
