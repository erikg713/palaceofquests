import os
import logging
from flask import Blueprint, request, jsonify, current_app
import requests

marketplace = Blueprint('marketplace', __name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

logging.basicConfig(level=logging.INFO)

def get_supabase_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

@marketplace.route('/marketplace/sell', methods=['POST'])
def sell_item():
    """
    Endpoint to mark an item as sold and remove it from inventory.
    Expects JSON: { "item_id": <id> }
    """
    data = request.get_json(silent=True)
    if not data or 'item_id' not in data:
        logging.warning("Missing item_id in request payload.")
        return jsonify({"error": "Missing 'item_id' in request body."}), 400

    item_id = data['item_id']

    try:
        resp = requests.delete(
            f"{SUPABASE_URL}/rest/v1/inventory?id=eq.{item_id}",
            headers=get_supabase_headers(),
            timeout=5
        )
        if resp.status_code not in (200, 204):
            logging.error(f"Supabase delete failed: {resp.text}")
            return jsonify({"error": "Failed to mark item as sold."}), 502

        # TODO: Log sale in a sales table; trigger payout logic here.

        logging.info(f"Item {item_id} marked as sold.")
        return jsonify({"status": "sold"}), 200

    except requests.RequestException as exc:
        logging.exception("Error communicating with Supabase")
        return jsonify({"error": "Internal server error."}), 500

@app.route('/marketplace/sell', methods=['POST'])
def sell_item():
    data = request.json
    item_id = data.get('item_id')

    # Optional: remove item
    requests.delete(f"{SUPABASE_URL}/rest/v1/inventory?id=eq.{item_id}",
                    headers=get_supabase_headers())

    # Log sale (optional)
    # Trigger Pi payout in future phase
    return jsonify({"status": "sold"})
