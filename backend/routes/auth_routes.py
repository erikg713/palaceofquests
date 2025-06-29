# backend/routes/auth_routes.py
from flask import Blueprint, request, jsonify
import requests
import jwt
from app.models import db, User
from app.config import settings
from app.services.item_effects import trigger_item_effect

@auth_bp.route('/payment/complete', methods=['POST'])
def complete_payment():
    payment_id = request.json.get('paymentId')
    txid = request.json.get('txid')
    payment = pi.complete_payment(payment_id, txid)

    item_id = payment['metadata']['item_id']
    user_id = payment['user_uid']

    # Add item to inventory
    inv = Inventory.query.filter_by(user_id=user_id, item_id=item_id).first()
    if inv:
        inv.qty += 1
    else:
        inv = Inventory(user_id=user_id, item_id=item_id, qty=1)
        db.session.add(inv)

    # 🔥 Trigger effect
    trigger_item_effect(user_id, item_id)

    db.session.commit()
    return jsonify({ "success": True, "item_id": item_id })

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/pi-login", methods=["POST"])
def pi_login():
    data = request.json
    access_token = data.get("accessToken")
    user_uid = data.get("user").get("uid")

    # Verify Pi token with Pi server
    headers = {"Authorization": f"Bearer {access_token}"}
    r = requests.get("https://api.minepi.com/me", headers=headers)
    if r.status_code != 200 or r.json().get("uid") != user_uid:
        return jsonify({"error": "Invalid Pi login"}), 401

    # Create user if doesn't exist
    user = User.query.get(user_uid)
    if not user:
        user = User(id=user_uid, username=data["user"]["username"])
        db.session.add(user)
        db.session.commit()

    # Create JWT token
    token = jwt.encode({"user_id": user.id}, settings.JWT_SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token})

@auth_bp.route("/me", methods=["GET"])
def me():
    from app.utils.security import verify_token
    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    # Use Pi API to get balance
    pi_headers = {"Authorization": f"Key {settings.PI_API_KEY}"}
    balance_url = f"https://api.minepi.com/v2/users/{user.id}/balance"
    r = requests.get(balance_url, headers=pi_headers)
    pi_balance = r.json().get("balance") if r.ok else "?"

    return jsonify({
        "username": user.username,
        "uid": user.id,
        "balance": pi_balance
    })
