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
