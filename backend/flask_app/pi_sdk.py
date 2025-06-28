# pi_sdk.py
import requests
import os
from flask import current_app
from pi_network_sdk import PiNetwork

def initialize_pi_sdk():
    pi = PiNetwork()
    pi.initialize(
        current_app.config["PI_API_KEY"],
        current_app.config["PI_WALLET_PRIVATE_SEED"],
        current_app.config["PI_NETWORK"]
    )
    return pi

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
