import requests
BASE_URL = "http://localhost:8000"
login_data = {"username": "admin", "password": "password123"}
token = requests.post(f"{BASE_URL}/token", data=login_data).json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# Create client
client_id = requests.post(f"{BASE_URL}/clients/", json={"name": "Doc Test", "cpf_cnpj": "222"}, headers=headers).json().get("id")
# Create prop
prop_id = requests.post(f"{BASE_URL}/properties/", json={"name": "Prop Doc", "total_area": 1, "city": "X", "owner_id": client_id}, headers=headers).json().get("id")
# Create service
service_id = requests.post(f"{BASE_URL}/services/", json={
    "service_type": "CAR", "client_id": client_id, "property_id": prop_id, "responsible_id": 1, "value": 100
}, headers=headers).json().get("id")

resp = requests.get(f"{BASE_URL}/documents/generate/{service_id}", headers=headers)
print("Status:", resp.status_code)
print("Content-Type:", resp.headers.get("Content-Type"))
if "text/html" in resp.headers.get("Content-Type"):
    print("HTML Fallback working")
