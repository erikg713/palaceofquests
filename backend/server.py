import os
import logging
from logging.handlers import TimedRotatingFileHandler
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from marshmallow import Schema, fields, ValidationError
import requests

# --- Load environment variables ---
load_dotenv()

REQUIRED_ENV_VARS = ["PI_API_KEY", "PI_WALLET_SECRET"]
for var in REQUIRED_ENV_VARS:
    if not os.getenv(var):
        raise RuntimeError(f"Missing required environment variable: {var}")

PORT = int(os.getenv("PORT", 4000))
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "*")

# --- Logger Setup ---
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
logger = logging.getLogger("palaceofquests")
logger.setLevel(logging.INFO)
formatter = logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s")
info_handler = TimedRotatingFileHandler(
    f"{log_dir}/app.log", when="midnight", backupCount=14, encoding="utf-8"
)
info_handler.setLevel(logging.INFO)
info_handler.setFormatter(formatter)
logger.addHandler(info_handler)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": CORS_ORIGIN}}, methods=["POST"])
limiter = Limiter(get_remote_address, app=app, default_limits=[])

# --- Marshmallow Schema for Validation ---
class PaymentRequestSchema(Schema):
    username = fields.Str(required=True)
    amount = fields.Float(required=True)
    memo = fields.Str(required=True)
    metadata = fields.Dict(required=False)
    uid = fields.Str(required=True)

payment_schema = PaymentRequestSchema()

# --- Advanced Pi Network Integration ---
class PiNetworkService:
    BASE_URL = "https://api.minepi.com/v2"

    def __init__(self, api_key, wallet_secret):
        self.api_key = api_key
        self.wallet_secret = wallet_secret
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json"
        })

    def verify_access_token(self, access_token):
        """Verify Pi Network user access token and return user data."""
        url = f"{self.BASE_URL}/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        resp = self.session.get(url, headers=headers)
        if resp.status_code != 200:
            raise ValueError("Invalid or expired Pi access token.")
        return resp.json()

    def create_payment(self, username, amount, memo, metadata, uid):
        """Create a payment request with Pi Network."""
        url = f"{self.BASE_URL}/payments"
        payload = {
            "username": username,
            "amount": amount,
            "memo": memo,
            "metadata": metadata,
            "uid": uid,
        }
        resp = self.session.post(url, json=payload)
        if resp.status_code != 201:
            logger.error(f"Failed to create Pi payment: {resp.text}")
            raise RuntimeError("Could not create Pi payment.")
        return resp.json().get("payment_id")

    def submit_payment(self, payment_id):
        """Submit a payment for approval."""
        url = f"{self.BASE_URL}/payments/{payment_id}/submit"
        resp = self.session.post(url)
        if resp.status_code != 200:
            logger.error(f"Failed to submit payment {payment_id}: {resp.text}")
            raise RuntimeError("Could not submit payment.")
        return resp.json().get("txid")

    def complete_payment(self, payment_id, txid):
        """Complete a payment after it’s been approved."""
        url = f"{self.BASE_URL}/payments/{payment_id}/complete"
        payload = {"txid": txid}
        resp = self.session.post(url, json=payload)
        if resp.status_code != 200:
            logger.error(f"Failed to complete payment {payment_id}: {resp.text}")
            raise RuntimeError("Could not complete payment.")
        return resp.json()

    def get_payment(self, payment_id):
        """Get details about a payment."""
        url = f"{self.BASE_URL}/payments/{payment_id}"
        resp = self.session.get(url)
        if resp.status_code != 200:
            logger.error(f"Failed to fetch payment {payment_id}: {resp.text}")
            raise RuntimeError("Could not fetch payment.")
        return resp.json()

pi_service = PiNetworkService(
    api_key=os.getenv("PI_API_KEY"),
    wallet_secret=os.getenv("PI_WALLET_SECRET")
)

# --- Error Handling ---
@app.errorhandler(ValidationError)
def handle_validation(err):
    logger.warning(f"Validation error: {err.messages}")
    return jsonify({"error": err.messages}), 400

@app.errorhandler(Exception)
def handle_exception(err):
    logger.error(f"Unhandled exception: {str(err)}", exc_info=True)
    return jsonify({"error": str(err)}), 500

# --- API Endpoints ---
@app.route("/verify", methods=["POST"])
def verify_user():
    data = request.get_json(force=True)
    access_token = data.get("accessToken")
    if not access_token:
        return jsonify({"error": "Missing accessToken."}), 400
    try:
        user = pi_service.verify_access_token(access_token)
        logger.info(f"User verified through Pi: {user.get('uid')}")
        return jsonify({"user": user}), 200
    except Exception as e:
        logger.warning(f"User verification failed: {str(e)}")
        return jsonify({"error": str(e)}), 401

@app.route("/create-payment", methods=["POST"])
@limiter.limit("30 per 10 minutes")
def create_payment():
    data = request.get_json(force=True)
    validated = payment_schema.load(data)
    try:
        payment_id = pi_service.create_payment(
            validated["username"],
            validated["amount"],
            validated["memo"],
            validated.get("metadata", {}),
            validated["uid"],
        )
        logger.info(f"Created Pi payment: {payment_id} for user {validated['username']}")
        return jsonify({"paymentId": payment_id}), 201
    except Exception as e:
        logger.error(f"Create payment error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/submit-payment", methods=["POST"])
def submit_payment():
    data = request.get_json(force=True)
    payment_id = data.get("paymentId")
    if not payment_id:
        return jsonify({"error": "Missing paymentId."}), 400
    try:
        txid = pi_service.submit_payment(payment_id)
        logger.info(f"Submitted payment {payment_id} with txid {txid}")
        return jsonify({"txid": txid}), 200
    except Exception as e:
        logger.error(f"Submit payment error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/complete-payment", methods=["POST"])
def complete_payment():
    data = request.get_json(force=True)
    payment_id = data.get("paymentId")
    txid = data.get("txid")
    if not payment_id or not txid:
        return jsonify({"error": "Missing paymentId or txid."}), 400
    try:
        payment = pi_service.complete_payment(payment_id, txid)
        logger.info(f"Completed payment {payment_id}: {payment}")
        return jsonify({"payment": payment}), 200
    except Exception as e:
        logger.error(f"Complete payment error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/payment/<payment_id>", methods=["GET"])
def get_payment(payment_id):
    try:
        payment = pi_service.get_payment(payment_id)
        return jsonify({"payment": payment}), 200
    except Exception as e:
        logger.error(f"Get payment error: {str(e)}")
        return jsonify({"error": str(e)}), 404

# --- Start App ---
if __name__ == "__main__":
    logger.info(f"Starting Palace of Quests backend on port {PORT}")
    app.run(host="0.0.0.0", port=PORT)
class PiNetworkService:
    # ... existing methods ...

    def processOrder(self, username, amount, memo, metadata, uid):
        """
        Process an order by creating, submitting, and completing a payment.
        Args:
            username (str): User's Pi Network username
            amount (float): Payment amount
            memo (str): Payment description
            metadata (dict): Additional payment metadata
            uid (str): Unique user ID
        Returns:
            dict: Completed payment details
        Raises:
            RuntimeError: If any step in the payment process fails
        """
        logger.info(f"Processing order for user {username}, amount {amount}")
        try:
            # Step 1: Create payment
            payment_id = self.create_payment(username, amount, memo, metadata, uid)
            logger.info(f"Created payment {payment_id}")

            # Step 2: Submit payment
            txid = self.submit_payment(payment_id)
            logger.info(f"Submitted payment {payment_id} with txid {txid}")

            # Step 3: Complete payment
            payment = self.complete_payment(payment_id, txid)
            logger.info(f"Completed payment {payment_id}")

            return payment
        except Exception as e:
            logger.error(f"Order processing failed for user {username}: {str(e)}")
            raise RuntimeError(f"Failed to process order: {str(e)}")

# New Flask endpoint
@app.route("/process-order", methods=["POST"])
@limiter.limit("30 per 10 minutes")
def process_order():
    try:
        data = request.get_json(force=True)
        validated = payment_schema.load(data)
        payment = pi_service.processOrder(
            validated["username"],
            validated["amount"],
            validated["memo"],
            validated.get("metadata", {}),
            validated["uid"],
        )
        logger.info(f"Order processed successfully for user {validated['username']}")
        return jsonify({"payment": payment}), 200
    except ValidationError as e:
        logger.warning(f"Validation error: {e.messages}")
        return jsonify({"error": e.messages}), 400
    except Exception as e:
        logger.error(f"Process order error: {str(e)}")
        return jsonify({"error": str(e)}), 500
class PiNetworkService:
    BASE_URL = "https://api.minepi.com/v2"

    def __init__(self, api_key, wallet_secret):
        self.api_key = api_key
        self.wallet_secret = wallet_secret
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json"
        })

    def _make_request(self, method, endpoint, payload=None, headers=None):
        """
        Generic method to make HTTP requests to Pi Network API.
        Args:
            method (str): HTTP method (e.g., 'GET', 'POST')
            endpoint (str): API endpoint (e.g., '/payments')
            payload (dict, optional): Request payload for POST requests
            headers (dict, optional): Additional headers
        Returns:
            dict: JSON response
        Raises:
            RuntimeError: If the request fails
        """
        url = f"{self.BASE_URL}{endpoint}"
        try:
            resp = self.session.request(method, url, json=payload, headers=headers)
            if resp.status_code not in (200, 201):
                logger.error(f"API request failed: {method} {url} - {resp.text}")
                raise RuntimeError(f"API request failed: {resp.text}")
            return resp.json()
        except requests.RequestException as e:
            logger.error(f"API request error: {method} {url} - {str(e)}")
            raise RuntimeError(f"API request error: {str(e)}")

    def create_payment(self, username, amount, memo, metadata, uid):
        payload = {
            "username": username,
            "amount": amount,
            "memo": memo,
            "metadata": metadata,
            "uid": uid,
        }
        return self._make_request("POST", "/payments", payload).get("payment_id")

    def submit_payment(self, payment_id):
        return self._make_request("POST", f"/payments/{payment_id}/submit").get("txid")

    def complete_payment(self, payment_id, txid):
        payload = {"txid": txid}
        return self._make_request("POST", f"/payments/{payment_id}/complete", payload)

    def get_payment(self, payment_id):
        return self._make_request("GET", f"/payments/{payment_id}")

    def verify_access_token(self, access_token):
        headers = {"Authorization": f"Bearer {access_token}"}
        return self._make_request("GET", "/me", headers=headers)