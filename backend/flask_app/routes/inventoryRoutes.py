from flask import request, jsonify
import requests
import logging

@app.route('/inventory/<uid>', methods=['GET'])
def get_inventory(uid):
    try:
        # Validate UID
        if not uid or not uid.isalnum():
            return jsonify({"error": "Invalid user ID"}), 400

        # Log the incoming request
        logging.info(f"Fetching inventory for user: {uid}")

        # Make the request to Supabase
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/inventory?user_id=eq.{uid}",
            headers=get_supabase_headers()
        )

        # Check for errors in the Supabase response
        if response.status_code != 200:
            logging.error(f"Supabase API Error: {response.status_code} - {response.text}")
            return jsonify({"error": "Failed to fetch inventory"}), 500

        # Return the inventory data
        data = response.json()
        return jsonify({"success": True, "data": data}), 200

    except Exception as e:
        # Log the exception
        logging.exception("An error occurred while fetching inventory")
        return jsonify({"error": "An internal server error occurred"}), 500
