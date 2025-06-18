# backend/pi_sdk/payments.py

import uuid
from flask import current_app

# In-memory store to simulate payments (replace with database)
payment_db = {}

def create_payment(username, amount, memo):
    payment_id = str(uuid.uuid4())
    payment = {
        "payment_id": payment_id,
        "username": username,
        "amount": amount,
        "memo": memo,
        "status": "PENDING",
    }
    payment_db[payment_id] = payment
    return payment

def complete_payment(payment_id):
    if payment_id in payment_db:
        payment_db[payment_id]["status"] = "COMPLETED"
        return payment_db[payment_id]
    raise ValueError("Payment not found")

def get_payment_status(payment_id):
    return payment_db.get(payment_id, None)

