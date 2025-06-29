import os
import uuid
import logging
from typing import Any, Dict

import requests
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import load_dotenv
from marshmallow import Schema, fields, ValidationError
from backend.routes.game_routes import game_bp
from backend.routes.auth_routes import auth_bp

app.register_blueprint(game_bp)
app.register_blueprint(auth_bp)
# --- Environment Setup ---
load_dotenv()

REQUIRED_ENV_VARS = ["PI_API_KEY", "SUPABASE_URL", "SUPABASE_KEY"]
missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

PI_API_KEY = os.environ["PI_API_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
)
logger = logging.getLogger("palaceofquests.backend")

# --- Flask App ---
app = Flask(__name__)
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "https://your-frontend-domain.com",
        "http://localhost:3000"
    ]}},
    supports_credentials=True
)

# --- HTTP Session with Retries ---
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

SESSION = requests.Session()
retry_strategy = Retry(
    total=3,
    status_forcelist=[429, 500, 502, 503, 504],
    backoff_factor=1,
)
adapter = HTTPAdapter(max_retries=retry_strategy)
SESSION.mount("https://", adapter)
SESSION.mount("http://", adapter)
DEFAULT_TIMEOUT = 5  # seconds

# --- Utils ---
def get_pi_headers() -> Dict[str, str]:
    return {
        "Authorization": f"Key {PI_API_KEY}",
        "Content-Type": "application/json"
    }

def get_supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

def handle_upstream_error(err: Exception, api: str):
    logger.error(f"{api} failed: {err}")
    resp = getattr(err, 'response', None)
    if resp is not None:
        logger.error(f"Upstream response: {resp.text}")
    abort(502, description=f"Upstream {api} API error")

def json_error(message: str, status_code: int = 400):
    response = jsonify({"error": message})
    response.status_code = status_code
    return response

# --- Schemas (Singletons for efficiency) ---
class PaymentCreateSchema(Schema):
    uid = fields.String(required=True)
    amount = fields.Float(required=True)
    memo = fields.String(required=True)
    metadata = fields.Dict(missing=dict)

class PaymentActionSchema(Schema):
    paymentId = fields.String(required=True)
    txid = fields.String(required=False)

payment_create_schema = PaymentCreateSchema()
payment_action_schema = PaymentActionSchema()

# --- Routes ---
@app.route("/", methods=["GET"])
def health() -> Any:
    return jsonify({"status": "Backend running"})

@app.route("/payment/create", methods=["POST"])
def create_payment() -> Any:
    try:
        data = payment_create_schema.load(request.get_json())
    except ValidationError as err:
        return json_error(err.messages, 400)

    payment_id = str(uuid.uuid4())
    payload = {
        "amount": str(data["amount"]),
        "memo": data["memo"],
        "metadata": data.get("metadata", {}),
        "uid": data["uid"],
        "payment_id": payment_id,
    }
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments",
            headers=get_pi_headers(),
            json=payload,
            timeout=DEFAULT_TIMEOUT
        )
        resp.raise_for_status()
        pi_response = resp.json()
    except Exception as err:
        handle_upstream_error(err, "Pi Network")
    return jsonify({"payment_id": payment_id, "pi_response": pi_response})

@app.route("/payment/complete", methods=["POST"])
def complete_payment() -> Any:
    try:
        data = payment_action_schema.load(request.get_json())
    except ValidationError as err:
        return json_error(err.messages, 400)
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments/{data['paymentId']}/complete",
            headers=get_pi_headers(),
            json={"txid": data.get("txid")},
            timeout=DEFAULT_TIMEOUT
        )
        resp.raise_for_status()
        pi_response = resp.json()
    except Exception as err:
        handle_upstream_error(err, "Pi Network")
    return jsonify(pi_response)

@app.route("/payment/cancel", methods=["POST"])
def cancel_payment() -> Any:
    try:
        data = payment_action_schema.load(request.get_json())
    except ValidationError as err:
        return json_error(err.messages, 400)
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments/{data['paymentId']}/cancel",
            headers=get_pi_headers(),
            timeout=DEFAULT_TIMEOUT
        )
        resp.raise_for_status()
        pi_response = resp.json()
    except Exception as err:
        handle_upstream_error(err, "Pi Network")
    return jsonify(pi_response)

# --- Entry point ---
if __name__ == "__main__":
    # Only for development; use Gunicorn or similar in production
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
