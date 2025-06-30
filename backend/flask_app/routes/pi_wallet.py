import os
from flask import Blueprint, request, jsonify, session
from pi_sdk import PiNetworkAPI, PiNetworkException  # Assume pi-backend-sdk provides this
from dotenv import load_dotenv

load_dotenv()

pi_wallet_bp = Blueprint('pi_wallet', __name__)

# Initialize Pi Network API client
pi_api = PiNetworkAPI(
    api_key=os.getenv('PI_API_KEY'),
    api_secret=os.getenv('PI_SECRET'),
    app_id=os.getenv('PI_APP_ID')
)

@pi_wallet_bp.route('/pi/login', methods=['POST'])
def pi_login():
    """Authenticate user with Pi Network."""
    payload = request.json
    user_uid = payload.get('user_uid')
    access_token = payload.get('access_token')
    try:
        user_info = pi_api.authenticate(user_uid, access_token)
        # Store user session securely
        session['user_id'] = user_info['uid']
        session['username'] = user_info['username']
        return jsonify({'success': True, 'user': user_info}), 200
    except PiNetworkException as e:
        return jsonify({'success': False, 'error': str(e)}), 401

@pi_wallet_bp.route('/pi/balance', methods=['GET'])
def pi_balance():
    """Get Pi wallet balance for the authenticated user."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Authentication required.'}), 401
    try:
        balance = pi_api.get_balance(user_id)
        return jsonify({'success': True, 'balance': balance}), 200
    except PiNetworkException as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@pi_wallet_bp.route('/pi/pay', methods=['POST'])
def pi_pay():
    """Process a Pi payment from the authenticated user."""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'Authentication required.'}), 401

    payload = request.json
    amount = payload.get('amount')
    recipient_uid = payload.get('recipient_uid')
    memo = payload.get('memo', '')

    if not all([amount, recipient_uid]):
        return jsonify({'success': False, 'error': 'Missing payment fields.'}), 400

    try:
        payment_result = pi_api.create_payment(
            sender_uid=user_id,
            recipient_uid=recipient_uid,
            amount=amount,
            memo=memo
        )
        return jsonify({'success': True, 'payment': payment_result}), 200
    except PiNetworkException as e:
        return jsonify({'success': False, 'error': str(e)}), 400
