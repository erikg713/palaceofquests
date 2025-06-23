# pi_sdk.py
import requests
import os

PI_API_KEY = os.getenv("PI_API_KEY")

def approve_payment(payment_id):
    url = f"https://api.minepi.com/v2/payments/{payment_id}/approve"
    headers = {
        "Authorization": f"Key {PI_API_KEY}"
    }
    response = requests.post(url, headers=headers)
    return response.json()

def complete_payment(payment_id, txid):
    url = f"https://api.minepi.com/v2/payments/{payment_id}/complete"
    headers = {
        "Authorization": f"Key {PI_API_KEY}"
    }
    json_data = {
        "txid": txid
    }
    response = requests.post(url, headers=headers, json=json_data)
    return response.json()