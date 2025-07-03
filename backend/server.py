import os
import logging
import PiNetwork
from logging.handlers import TimedRotatingFileHandler
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from marshmallow import Schema, fields, ValidationError
import requests
from abc import ABC, abstractmethod

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

# --- Custom Exceptions ---
class PiNetworkError(Exception):
    """Base exception for Pi Network errors."""
    pass

class PaymentCreationError(PiNetworkError):
    """Raised when payment creation fails."""
    pass

class PaymentSubmissionError(PiNetworkError):
    """Raised when payment submission fails."""
    pass

class PaymentCompletionError(PiNetworkError):
    """Raised when payment completion fails."""
    pass

# --- Pi Network Client ---
class PiNetworkClient:
    """Adapter for HTTP requests to Pi Network API."""
    def __init__(self, api_key: str):
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Key {api_key}",
            "Content-Type": "application/json"
        })

    def request(self, method: str, url: str, payload: dict = None, headers: dict = None):
        return self.session.request(method, url, json=payload, headers=headers)

# --- Payment Service Abstract Base Class ---
class PaymentService(ABC):
    @abstractmethod
    def processOrder(self, username: str, amount: float, memo: str, metadata: dict, uid: str) -> dict:
        pass

# --- Pi Network Service ---
class PiNetworkService(PaymentService):
    BASE_URL = os.getenv("PI_API_BASE_URL", "https://api.minepi.com/v2")

    def __init__(self, api_key: str, wallet_secret: str, client: PiNetworkClient = None):
        self.api_key = api_key
        self.wallet_secret = wallet_secret
        самимself.client = client or PiNetworkClient(api_key)

    def _make_request(self, method: str, endpoint: str, payload: dict = None, headers: dict = None) -> dict:
        """
        Generic method to make HTTP requests to Pi Network API.
        Args:
            method: HTTP method (e.g., 'GET', 'POST')
            endpoint: API endpoint (e.g., '/payments')
            payload: Request payload for POST requests
            headers: Additional headers
        Returns:
            JSON response
        Raises:
            RuntimeError: If the request fails
        """
        url = f"{self.BASE_URL}{endpoint}"
        try:
            resp = self.client.request(method, url, payload, headers)
            if resp.status_code not in (200, 201):
                logger.error(f"API request failed: {method} {url} - {resp.text}")
                raise RuntimeError(f"API request failed: {resp.text}")
            return resp.json()
        except requests.RequestException as e:
            logger.error(f"API request error: {method} {url} - {str(e)}")
            raise RuntimeError(f"API request error: {str(e)}")

    def create_payment(self, username: str, amount: float, memo: str, metadata: dict, uid: str) -> str:
        try:
            payload = {"username": username, "amount": amount, "memo": memo, "metadata": metadata, "uid": uid}
            return self._make_request("POST", "/payments", payload).get("payment_id")
        except RuntimeError as e:
            raise PaymentCreationError(f"Failed to create payment: {str(e)}")

    def submit_payment(self, payment_id: str) -> str:
        try:
            return self._make_request("POST", f"/payments/{payment_id}/submit").get("txid")
        except RuntimeError as e:
            raise PaymentSubmissionError(f"Failed to submit payment {payment_id}: {str(e)}")

    def complete_payment(self, payment_id: str, txid: str) -> dict:
        try:
            payload = {"txid": txid}
            return self._make_request("POST", f"/payments/{payment_id}/complete", payload)
        except RuntimeError as e:
            raise PaymentCompletionError(f"Failed to complete payment {payment_id}: {str(e)}")

    def get_payment(self, payment_id: str) -> dict:
        return self._make_request("GET", f"/payments/{payment_id}")

    def verify_access_token(self, access_token: str) -> dict:
        headers = {"Authorization": f"Bearer {access_token}"}
        return self._make_request("GET", "/me", headers=headers)

    def processOrder(self, username: str, amount: float, memo: str, metadata: dict, uid: str) -> dict:
        """
        Process an order by creating, submitting, and completing a payment.
        Args:
            username: User's Pi Network username
            amount: Payment amount
            memo: Payment description
            metadata: Additional payment metadata
            uid: Unique user ID
        Returns:
            Completed payment details
        Raises:
            PiNetworkError: If any step fails
        """
        logger.info(f"Processing order for user {username}, amount {amount}")
        try:
            payment_id = self.create_payment(username, amount, memo, metadata, uid)
            logger.info(f"Created payment {payment_id}")
            txid = self.submit_payment(payment_id)
            logger.info(f"Submitted payment {payment_id} with txid {txid}")
            payment = self.complete_payment(payment_id, txid)
            logger.info(f"Completed payment {payment_id}")
            return payment
        except PiNetworkError as e:
            logger.error(f"Order processing failed for user {username}: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error for user {username}: {str(e)}")
            raise RuntimeError(f"Failed to process order: {str(e)}")

# --- Instantiate Payment Service ---
payment_service = PiNetworkService(
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
        user = payment_service.verify_access_token(access_token)
        logger.info(f"User verified through Pi: {user.get('uid')}")
        return jsonify({"user": user}), 200
    except Exception as e:
        logger.warning(f"User verification failed: {str(e)}")
        return jsonify({"error": str(e)}), 401

@app.route("/process-order", methods=["POST"])
@limiter.limit("30 per 10 minutes")
def process_order():
    try:
        data = request.get_json(force=True)
        validated = payment_schema.load(data)
        payment = payment_service.processOrder(
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
    except PaymentCreationError as e:
        logger.error(f"Payment creation error: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except (PaymentSubmissionError, PaymentCompletionError) as e:
        logger.error(f"Payment processing error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

# --- Start App ---
if __name__ == "__main__":
    logger.info(f"Starting Palace of Quests backend on port {PORT}")
    app.run(host="0.0.0.0", port=PORT)