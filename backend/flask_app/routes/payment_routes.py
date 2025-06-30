from flask import Blueprint, request, jsonify, current_app
from werkzeug.exceptions import BadRequest, InternalServerError
from marshmallow import Schema, fields, ValidationError
from app.utils.pi_network import PiNetwork
import os

# Initialize Pi SDK
pi = PiNetwork()
pi.initialize(
    api_key=os.getenv("PI_API_KEY"),
    wallet_private_key=os.getenv("PI_WALLET_SECRET"),
    network="Pi Network"  # or "Pi Testnet"
)

# Blueprint definition
payment_bp = Blueprint('payment', __name__, url_prefix='/payment')

# Marshmallow schema for input validation
class PaymentRequestSchema(Schema):
    amount = fields.Float(required=True, validate=lambda x: x > 0)
    currency = fields.Str(required=True)
    method = fields.Str(required=True)
    reference = fields.Str(required=False)

# Example: Payment processor placeholder
def process_payment(amount, currency, method, reference=None):
    # TODO: Integrate with real payment gateway here
    # Simulate payment logic
    if method not in ('credit_card', 'paypal'):
        raise ValueError("Unsupported payment method.")
    return {
        "status": "success",
        "transaction_id": "txn_1234567890",
        "amount": amount,
        "currency": currency,
        "method": method,
        "reference": reference
    }

@payment_bp.route('/create', methods=['POST'])
def create_payment():
    try:
        # Input validation
        schema = PaymentRequestSchema()
        data = schema.load(request.json)

        # Payment processing
        result = process_payment(
            amount=data['amount'],
            currency=data['currency'],
            method=data['method'],
            reference=data.get('reference')
        )

        return jsonify({
            "success": True,
            "payment": result
        }), 201

    except ValidationError as e:
        raise BadRequest(e.messages)
    except ValueError as e:
        raise BadRequest(str(e))
    except Exception as e:
        current_app.logger.error(f"Payment processing error: {e}")
        raise InternalServerError("An unexpected error occurred. Please try again later.")

# To register this blueprint, add in your app factory:
# from .routes.payment import payment_bp
# app.register_blueprint(payment_bp)
