# backend/flask_app/api/POST/payment/create.py

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest
from your_database_module import create_payment_record  # Replace with your actual DB logic

bp = Blueprint('payment_create', __name__, url_prefix='/api/POST/payment')

@bp.route('/create', methods=['POST'])
def create_payment():
    try:
        data = request.get_json(force=True)
        uid = data.get('uid')
        amount = data.get('amount')
        memo = data.get('memo')
        metadata = data.get('metadata', {})

        # Basic validation
        if not uid or not amount:
            raise BadRequest("Missing required fields: 'uid' and/or 'amount'.")

        # Amount should be numeric
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except (ValueError, TypeError):
            raise BadRequest("'amount' must be a positive number.")

        # Insert payment record (replace with your actual DB logic)
        payment_id = create_payment_record(
            uid=uid,
            amount=amount,
            memo=memo,
            metadata=metadata
        )

        return jsonify({
            "success": True,
            "payment_id": payment_id,
            "message": "Payment created successfully."
        }), 201

    except BadRequest as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        return jsonify({"success": False, "error": "Internal server error."}), 500
