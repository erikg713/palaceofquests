import os
import uuid
import logging
from typing import Any, Dict

import requests
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import load_dotenv
from marshmallow import Schema, fields, ValidationError

# --- Environment Setup ---
load_dotenv()

REQUIRED_ENV_VARS = ["PI_API_KEY", "SUPABASE_URL", "SUPABASE_KEY"]
missing_vars = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

PI_API_KEY = os.getenv("PI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# --- Logging ---
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
logger = logging.getLogger("palaceofquests.backend")

# --- Flask App ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://your-frontend-domain.com", "http://localhost:3000"]}})  # Adjust as needed

# --- HTTP Session with Retries ---
SESSION = requests.Session()
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
retry_strategy = Retry(
    total=3,
    status_forcelist=[429, 500, 502, 503, 504],
    backoff_factor=1,
)
adapter = HTTPAdapter(max_retries=retry_strategy)
SESSION.mount("https://", adapter)
SESSION.mount("http://", adapter)

# --- Utils ---
def get_pi_headers() -> Dict[str, str]:
    return {"Authorization": f"Key {PI_API_KEY}", "Content-Type": "application/json"}

def get_supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

def handle_upstream_error(e: Exception, api: str):
    logger.error(f"{api} failed: {str(e)}")
    response = getattr(e, 'response', None)
    if response is not None:
        logger.error(f"Upstream response: {response.text}")
    abort(502, description=f"Upstream {api} API error")

def json_error(message: str, status_code: int = 400):
    response = jsonify({"error": message})
    response.status_code = status_code
    return response

# --- Schemas ---
class PaymentCreateSchema(Schema):
    uid = fields.String(required=True)
    amount = fields.Float(required=True)
    memo = fields.String(required=True)
    metadata = fields.Dict(missing=dict)

class PaymentActionSchema(Schema):
    paymentId = fields.String(required=True)
    txid = fields.String(required=False)

# --- Routes ---

@app.route("/", methods=["GET"])
def health() -> Any:
    """Health check."""
    return jsonify({"status": "Backend running"})

@app.route('/payment/create', methods=['POST'])
def create_payment() -> Any:
    """Create a new Pi payment."""
    try:
        data = PaymentCreateSchema().load(request.get_json(force=True))
    except ValidationError as err:
        return json_error(err.messages, 400)

    payment_id = str(uuid.uuid4())
    payload = {
        "amount": str(data["amount"]),
        "memo": data["memo"],
        "metadata": data.get("metadata", {}),
        "uid": data["uid"],
        "payment_id": payment_id
    }
    try:
        resp = SESSION.post(
            "https://api.minepi.com/v2/payments",
            headers=get_pi_headers(),
            json=payload,
            timeout=10
        )
        resp.raise_for_status()
        logger.info(f"Payment created: {payment_id} for user {data['uid']}")
        return jsonify(resp.json())
    except requests.RequestException as e:
        handle_upstream_error(e, "Pi Network")

@app.route("/payment/approve", methods=["POST"])
def approve_payment() -> Any:
    """Approve a Pi payment."""
    try:
        data = PaymentActionSchema().load(request.get_json(force=True), partial=("txid",))
    except ValidationError as err:
        return json_error(err.messages, 400)

    payment_id = data["paymentId"]
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/approve",
            headers=get_pi_headers(),
            timeout=10
        )
        resp.raise_for_status()
        logger.info(f"Payment approved: {payment_id}")
        return jsonify(resp.json())
    except requests.RequestException as e:
        handle_upstream_error(e, "Pi Network")

@app.route("/payment/complete", methods=["POST"])
def complete_payment() -> Any:
    """Complete a Pi payment."""
    try:
        data = PaymentActionSchema().load(request.get_json(force=True))
    except ValidationError as err:
        return json_error(err.messages, 400)

    payment_id = data["paymentId"]
    txid = data.get("txid")
    if not txid:
        return json_error("Missing txid", 400)
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/complete",
            headers=get_pi_headers(),
            json={"txid": txid},
            timeout=10
        )
        resp.raise_for_status()
        logger.info(f"Payment completed: {payment_id} txid={txid}")
        return jsonify(resp.json())
    except requests.RequestException as e:
        handle_upstream_error(e, "Pi Network")

@app.route('/fuse-items', methods=['POST'])
def fuse_items():
    data = request.json
    user_id = data.get('user_id')
    item_ids = data.get('item_ids')

    if not user_id or not item_ids or not isinstance(item_ids, list):
        return jsonify({'error': 'Missing or invalid payload'}), 400

    # 1. Remove existing items (simulate burn)
    for item_id in item_ids:
        requests.delete(
            f"{SUPABASE_URL}/rest/v1/inventory?id=eq.{item_id}",
            headers=get_supabase_headers()
        )

    # 2. Define fusion result (example logic)
    fused_item = {
        "item_name": "Omega Blade",
        "rarity": "legendary"
    }

    # 3. Add fused item to inventory
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/inventory",
        headers=get_supabase_headers(),
        json={
            "user_id": user_id,
            "item_name": fused_item["item_name"],
            "realm_id": "fusion_lab"
        }
    )

    return jsonify({"result": fused_item})


# --- Main Entry ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
