from flask import Blueprint, request, jsonify
from pi_sdk import verify_user, create_payment, complete_payment

pi_bp = Blueprint('pi', __name__)

@pi_bp.route("/auth", methods=["POST"])
def authenticate_pi_user():
    data = request.get_json()
    identity = data.get("identity")
    signature = data.get("signature")

    try:
        user = verify_user(identity, signature)
        return jsonify({"status": "success", "user": user})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401

@pi_bp.route("/create_payment", methods=["POST"])
def create_pi_payment():
    data = request.get_json()
    username = data.get("username")
    amount = data.get("amount")
    memo = data.get("memo")

    payment = create_payment(username, amount, memo)
    return jsonify(payment)

@pi_bp.route("/complete_payment/<payment_id>", methods=["POST"])
def complete_pi_payment(payment_id):
    try:
        payment = complete_payment(payment_id)
        return jsonify(payment)
    except Exception as e:
        return jsonify({"error": str(e)}), 404
