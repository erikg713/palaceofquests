import os
import requests
import logging
from typing import Dict, Any, Optional
from supabase import create_client, Client as SupabaseClient

PI_API_ENDPOINT = "https://api.minepi.com/v2/"
PI_API_KEY = os.environ.get("PI_API_KEY")
PI_APP_ID = os.environ.get("PI_APP_ID")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

logger = logging.getLogger("palaceofquests.pi_payment")
logger.setLevel(logging.INFO)

# Configure logging to stdout if not already configured
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Initialize Supabase client
_supabase: Optional[SupabaseClient] = None

def get_supabase() -> SupabaseClient:
    global _supabase
    if _supabase is None:
        _supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase

class PiPaymentService:
    """
    Handles payment operations with the Pi Network and logs transactions to Supabase.
    """

    def __init__(self):
        self.api_key = PI_API_KEY
        self.app_id = PI_APP_ID
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json"
        })
        self.supabase = get_supabase()

    def verify_payment(self, payment_id: str, user_uid: str) -> Dict[str, Any]:
        """
        Verify a Pi Network payment and log it in Supabase.
        :param payment_id: Pi payment identifier
        :param user_uid: Palaceofquests user UID (for traceability)
        :return: Pi API response
        """
        url = f"{PI_API_ENDPOINT}payments/{payment_id}"
        try:
            response = self.session.get(url)
            response.raise_for_status()
            payment_data = response.json()
            logger.info(f"Verified payment {payment_id}: {payment_data}")

            # Log to Supabase
            self.log_transaction(payment_data, user_uid, action="verify")
            return payment_data
        except requests.RequestException as e:
            logger.error(f"Error verifying payment {payment_id}: {e}")
            raise

    def create_payment(self, amount: float, user_uid: str, memo: str, metadata: dict) -> Dict[str, Any]:
        """
        Create a new Pi Network payment and log it in Supabase.
        :param amount: Payment amount (in Pi)
        :param user_uid: Palaceofquests user UID
        :param memo: Description for the transaction
        :param metadata: Additional data to associate with the payment
        :return: Pi API response
        """
        url = f"{PI_API_ENDPOINT}payments"
        payload = {
            "amount": amount,
            "memo": memo,
            "metadata": metadata,
            "app_id": self.app_id
        }
        try:
            response = self.session.post(url, json=payload)
            response.raise_for_status()
            payment_data = response.json()
            logger.info(f"Created payment: {payment_data}")

            # Log to Supabase
            self.log_transaction(payment_data, user_uid, action="create")
            return payment_data
        except requests.RequestException as e:
            logger.error(f"Error creating payment: {e}")
            raise

    def complete_payment(self, payment_id: str, txid: str, user_uid: str) -> Dict[str, Any]:
        """
        Complete a Pi Network payment after user approval and log it in Supabase.
        :param payment_id: Pi payment identifier
        :param txid: Blockchain transaction ID
        :param user_uid: Palaceofquests user UID
        :return: Pi API response
        """
        url = f"{PI_API_ENDPOINT}payments/{payment_id}/complete"
        payload = {"txid": txid}
        try:
            response = self.session.post(url, json=payload)
            response.raise_for_status()
            result = response.json()
            logger.info(f"Completed payment {payment_id}: {result}")

            # Log to Supabase
            self.log_transaction(result, user_uid, action="complete")
            return result
        except requests.RequestException as e:
            logger.error(f"Error completing payment {payment_id}: {e}")
            raise

    def log_transaction(self, payment_data: Dict[str, Any], user_uid: str, action: str):
        """
        Write a transaction log entry to Supabase.
        :param payment_data: Raw payment data from Pi API
        :param user_uid: Palaceofquests user UID
        :param action: One of 'create', 'verify', 'complete'
        """
        try:
            log_entry = {
                "user_uid": user_uid,
                "action": action,
                "payment_id": payment_data.get("identifier") or payment_data.get("payment_id"),
                "amount": payment_data.get("amount"),
                "status": payment_data.get("status"),
                "data": payment_data,
            }
            self.supabase.table("pi_payments_log").insert(log_entry).execute()
            logger.info(f"Logged transaction: {log_entry}")
        except Exception as e:
            logger.error(f"Failed to log transaction for user {user_uid}: {e}")

# Usage Example (inside a Flask route)
# from flask import Blueprint, request, jsonify
# pi_bp = Blueprint('pi', __name__)
# payment_service = PiPaymentService()
#
# @pi_bp.route("/api/pi/verify", methods=["POST"])
# def verify_payment():
#     payment_id = request.json.get("payment_id")
#     user_uid = request.json.get("user_uid")
#     try:
#         data = payment_service.verify_payment(payment_id, user_uid)
#         return jsonify(data), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
