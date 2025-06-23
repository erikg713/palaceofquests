from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

PI_API_KEY = os.getenv("PI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

@app.route('/')
def index():
    return jsonify({"status": "Backend running"})

@app.route('/payment/approve', methods=['POST'])
def approve():
    payment_id = request.json.get('paymentId')
    headers = {"Authorization": f"Key {PI_API_KEY}"}
    r = requests.post(f"https://api.minepi.com/v2/payments/{payment_id}/approve", headers=headers)
    return jsonify(r.json())

@app.route('/payment/complete', methods=['POST'])
def complete():
    payment_id = request.json.get('paymentId')
    txid = request.json.get('txid')
    headers = {"Authorization": f"Key {PI_API_KEY}"}
    r = requests.post(f"https://api.minepi.com/v2/payments/{payment_id}/complete", headers=headers, json={"txid": txid})
    return jsonify(r.json())

@app.route('/unlock-realm', methods=['POST'])
def unlock():
    user_id = request.json.get('user_id')
    realm_id = request.json.get('realm_id')
    r = requests.post(f"{SUPABASE_URL}/rest/v1/unlocks",
                      headers={
                          "apikey": SUPABASE_KEY,
                          "Authorization": f"Bearer {SUPABASE_KEY}",
                          "Content-Type": "application/json"
                      },
                      json={"user_id": user_id, "realm_id": realm_id})
    return jsonify(r.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)