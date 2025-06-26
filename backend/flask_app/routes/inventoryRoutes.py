@app.route('/inventory/<uid>', methods=['GET'])
def get_inventory(uid):
    r = requests.get(f"{SUPABASE_URL}/rest/v1/inventory?user_id=eq.{uid}",
                     headers=get_supabase_headers())
    return jsonify(r.json())
