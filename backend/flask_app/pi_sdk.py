import os
import requests
from flask import current_app

from pi_network_sdk import PiNetwork

def initialize_pi_sdk(config=None):
    """
    Initialize and return a PiNetwork SDK instance using provided or Flask config.
    """
    cfg = config or current_app.config
    pi = PiNetwork()
    pi.initialize(
        cfg["PI_API_KEY"],
        cfg["PI_WALLET_PRIVATE_SEED"],
        cfg["PI_NETWORK"]
    )
    return pi

def get_api_key(config=None):
    """
    Retrieve the Pi API key from config or environment.
    """
    cfg = config or current_app.config
    api_key = cfg.get("PI_API_KEY") or os.getenv("PI_API_KEY")
    if not api_key:
        raise RuntimeError("PI_API_KEY must be set in config or environment")
    return api_key

def get_requests_session():
    """
    Returns a requests.Session with sensible defaults.
    """
    session = requests.Session()
    session.headers.update({'Content-Type': 'application/json'})
    return session

def approve_payment(payment_id, config=None, session=None):
    """
    Approve a Pi Network payment by its ID.
    Returns the API response as dict.
    """
    if not payment_id or not isinstance(payment_id, str):
        raise ValueError("payment_id must be a non-empty string")

    api_key = get_api_key(config)
    url = f"https://api.minepi.com/v2/payments/{payment_id}/approve"
    headers = {"Authorization": f"Key {api_key}"}
    sess = session or get_requests_session()

    try:
        resp = sess.post(url, headers=headers, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as err:
        current_app.logger.error(f"Payment approval failed: {err}")
        return {"error": "Could not approve payment", "details": str(err)}

def complete_payment(payment_id, txid, config=None, session=None):
    """
    Complete a Pi Network payment by providing payment ID and transaction ID.
    Returns the API response as dict.
    """
    if not payment_id or not isinstance(payment_id, str):
        raise ValueError("payment_id must be a non-empty string")
    if not txid or not isinstance(txid, str):
        raise ValueError("txid must be a non-empty string")

    api_key = get_api_key(config)
    url = f"https://api.minepi.com/v2/payments/{payment_id}/complete"
    headers = {"Authorization": f"Key {api_key}"}
    payload = {"txid": txid}
    sess = session or get_requests_session()

    try:
        resp = sess.post(url, headers=headers, json=payload, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as err:
        current_app.logger.error(f"Payment completion failed: {err}")
        return {"error": "Could not complete payment", "details": str(err)}
