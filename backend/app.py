import os
import uuid
import logging
import requests

from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import load_dotenv

# --- Load .env ---
load_dotenv()

# --- Logging & Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("palaceofquests.backend")

app = Flask(__name__)
CORS(app)

PI_API_KEY = os.getenv("PI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SESSION = requests.Session()

# --- Helper Headers ---
def get_pi_headers():
    if not PI_API_KEY:
        logger.error("PI_API_KEY missing")
        raise RuntimeError("Internal server config error")
    return {"Authorization": f"Key {PI_API_KEY}", "Content-Type": "application/json"}

def get_supabase_headers():
    if not SUPABASE_KEY:
        logger.error("SUPABASE_KEY missing")
        raise RuntimeError("Internal server config error")
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

# --- Health Check ---
@app.route("/")
def index():
    return jsonify({"status": "Backend running"})

# --- Pi Payment: Create ---
@app.route('/payment/create', methods=['POST'])
def create_payment():
    data = request.get_json(force=True)
    uid = data.get('uid')
    amount = data.get('amount')
    memo = data.get('memo')
    metadata = data.get('metadata', {})

    if not all([uid, amount, memo]):
        return jsonify({"error": "Missing required fields"}), 400

    payment_id = str(uuid.uuid4())
    payload = {
        "amount": str(amount),
        "memo": memo,
        "metadata": metadata,
        "uid": uid,
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
        return jsonify(resp.json())
    except requests.RequestException as e:
        logger.error(f"/payment/create failed: {e}")
        abort(502, description="Pi Network payment API error")

# --- Pi Payment: Approve ---
@app.route("/payment/approve", methods=["POST"])
def approve():
    payment_id = request.json.get("paymentId")
    if not payment_id:
        abort(400, description="Missing paymentId")
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/approve",
            headers=get_pi_headers(),
            timeout=10
        )
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        logger.error(f"/payment/approve failed: {e}")
        abort(502, description="Upstream payment API error")

# --- Pi Payment: Complete ---
@app.route("/payment/complete", methods=["POST"])
def complete():
    payment_id = request.json.get("paymentId")
    txid = request.json.get("txid")
    if not payment_id or not txid:
        abort(400, description="Missing paymentId or txid")
    try:
        resp = SESSION.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/complete",
            headers=get_pi_headers(),
            json={"txid": txid},
            timeout=10
        )
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        logger.error(f"/payment/complete failed: {e}")
        abort(502, description="Upstream payment API error")

# --- Unlock Realm (Pi-Verified) ---
@app.route("/unlock-realm", methods=["POST"])
def unlock():
    data = request.get_json(force=True)
    user_id, realm_id = data.get("user_id"), data.get("realm_id")
    if not user_id or not realm_id:
        abort(400, description="Missing user_id or realm_id")
    try:
        resp = SESSION.post(
            f"{SUPABASE_URL}/rest/v1/unlocks",
            headers=get_supabase_headers(),
            json={"user_id": user_id, "realm_id": realm_id},
            timeout=10
        )
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.RequestException as e:
        logger.error(f"/unlock-realm failed: {e}")
        abort(502, description="Upstream Supabase error")

# --- Run ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)