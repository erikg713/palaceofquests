import os
import logging
from flask import Blueprint, request, jsonify, current_app
import requests

# Set up Blueprint for modular Flask app structure
marketplace_bp = Blueprint('marketplace', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase_headers():
    if not SUPABASE_KEY:
        logger.error("SUPABASE_KEY is not set in environment variables.")
        raise RuntimeError("Supabase API key missing.")
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }

@marketplace_bp.route('/marketplace/sell', methods=['POST'])
def sell_item():
    """
    Mark an item as sold; removes it from inventory.
    Expects JSON body: { "item_id": <int> }
    """
    data = request.get_json(silent=True)
    if not data or 'item_id' not in data:
        logger.warning("Missing or invalid 'item_id' in request payload.")
        return jsonify({"error": "Missing or invalid 'item_id'."}), 400

    item_id = data['item_id']
    if not isinstance(item_id, int) or item_id <= 0:
        logger.warning(f"Invalid item_id value: {item_id}")
        return jsonify({"error": "Invalid 'item_id'."}), 400

    try:
        # Remove item from inventory
        response = requests.delete(
            f"{SUPABASE_URL}/rest/v1/inventory?id=eq.{item_id}",
            headers=get_supabase_headers(),
            timeout=5
        )
        if response.status_code not in (200, 204):
            logger.error(f"Failed to remove item {item_id}: {response.text}")
            return jsonify({"error": "Failed to mark item as sold."}), 502

        # Sale logging and payout logic can be added here
        logger.info(f"Item {item_id} successfully marked as sold.")
        return jsonify({"status": "sold"}), 200

    except requests.RequestException as exc:
        logger.exception("Error communicating with Supabase")
        return jsonify({"error": "Upstream service error."}), 502
    except Exception as exc:
        logger.exception("Unexpected error in sell_item endpoint")
        return jsonify({"error": "Internal server error."}), 500
