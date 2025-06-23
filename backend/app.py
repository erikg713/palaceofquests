import os
import logging
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# --- Config & Setup ---
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("palaceofquests.backend")

app = Flask(__name__)
CORS(app)

PI_API_KEY = os.getenv("PI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

SESSION = requests.Session()

def get_pi_headers():
    if not PI_API_KEY:
        logger.error("PI_API_KEY missing")
        raise RuntimeError("Internal server config error")
    return {"Authorization": f"Key {PI_API_KEY}"}

def get_supabase_headers():
    if not SUPABASE_KEY:
        logger.error("SUPABASE_KEY missing")
        raise RuntimeError("Internal server config error")
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

# --- Routes ---
@app.route("/")
def index():
    return jsonify({"status": "Backend running"})

@app.route("/payment/approve", methods=["POST"])
def approve():
    data = request.get_json(force=True)
    payment_id = data.get("paymentId")
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

@app.route("/payment/complete", methods=["POST"])
def complete():
    data = request.get_json(force=True)
    payment_id = data.get("paymentId")
    txid = data.get("txid")
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
