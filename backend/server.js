import os
import logging
from logging.handlers import TimedRotatingFileHandler
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException
import requests

# --- Load environment variables early ---
load_dotenv()

# --- Environment Validation ---
REQUIRED_ENV_VARS = ["PI_API_KEY", "PI_WALLET_SECRET"]
for var in REQUIRED_ENV_VARS:
    if not os.getenv(var):
        raise RuntimeError(f"Missing required environment variable: {var}")

PORT = int(os.getenv("PORT", 4000))
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "*")

# --- Logger Setup (Rotating File, Console, Separate Error/Info) ---
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)

logger = logging.getLogger("palaceofquests")
logger.setLevel(logging.INFO)
formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")

# Info log
info_handler = TimedRotatingFileHandler(f"{log_dir}/app.log", when="midnight", backupCount=14, encoding="utf-8")
info_handler.setLevel(logging.INFO)
info_handler.setFormatter(formatter)
logger.addHandler(info_handler)

# Error log
error_handler = TimedRotatingFileHandler(f"{log_dir}/error.log", when="midnight", backupCount=30, encoding="utf-8")
error_handler.setLevel(logging.ERROR)
error_handler.setFormatter(formatter)
logger.addHandler(error_handler)

# Console
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": CORS_ORIGIN}}, methods=["POST"])

# --- Rate Limiting ---
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[],
    app=app
)
payment_limit = "30 per 10 minutes"

# --- Import/Initialize Pi Network SDK (Placeholder) ---
class PiNetwork:
    def __init__(self, api_key, wallet_secret):
        self.api_key = api_key
        self.wallet_secret = wallet_secret

    # Implement or import real Pi payment methods

pi = PiNetwork(os.getenv("PI_API_KEY"), os.getenv("PI_WALLET_SECRET"))

# --- Request Validation (Professional Style) ---
from marshmallow import Schema, fields, ValidationError, validates, validates_schema

class PaymentSchema(Schema):
    username = fields.Str(required=True)
    amount = fields.Float(required=True)
    metadata = fields.Dict(required=False)

    @validates("username")
    def validate_username(self, value):
        import re
        if not re.match(r"^[a-zA-Z0-9_]{3,32}$", value):
            raise ValidationError("Username must be 3-32 characters, alphanumeric or underscore.")

    @validates("amount")
    def validate_amount(self, value):
        if value <= 0:
            raise ValidationError("Amount must be positive.")

payment_schema = PaymentSchema()

# --- Centralized Error Handling ---
@app.errorhandler(ValidationError)
def handle_marshmallow_error(e):
    logger.warning(f"Validation error: {e.messages}")
    return jsonify({"error": e.messages}), 400

@app.errorhandler(Exception)
def handle_exception(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
    return jsonify({"error": str(e)}), code

# --- Main API Endpoint ---
@app.route('/create-payment', methods=["POST"])
@limiter.limit(payment_limit)
def create_payment():
    data = request.get_json(force=True)
    validated = payment_schema.load(data)
    # Implement payment creation logic, e.g.:
    # payment_id = pi.create_payment(...)
    payment_id = "demo-payment-id"  # Placeholder
    logger.info(f"Payment created: {validated['username']} requested {validated['amount']}")
    return jsonify({"paymentId": payment_id}), 201

# --- Start App ---
if __name__ == "__main__":
    logger.info(f"Starting Palace of Quests backend on port {PORT}")
    app.run(host="0.0.0.0", port=PORT)
