import base64
import json
from typing import Any, Dict
from flask import current_app

def verify_user(identity_payload: str, signature: str) -> Dict[str, Any]:
    """
    Validate the JWT identity payload sent from the Pi frontend SDK.
    Replace this logic with official Pi Network validation when available.

    Args:
        identity_payload (str): Base64-encoded JSON user identity payload.
        signature (str): Signature string for verification.

    Returns:
        dict: Contains 'username' and 'payload' on success.

    Raises:
        ValueError: If payload or signature is invalid.
    """
    try:
        decoded = base64.b64decode(identity_payload)
        payload = json.loads(decoded.decode("utf-8"))
        username = payload.get("user", {}).get("username")
        if not username:
            raise ValueError("Missing username in payload.")

        # Simulated signature validation (replace with real check once available).
        if not signature or len(signature) < 10:
            raise ValueError("Invalid or missing signature.")

        return {
            "username": username,
            "payload": payload,
        }
    except Exception as exc:
        raise ValueError(f"Authentication failed: {exc}")

def verify_pi_wallet(wallet_address: str, signature: str) -> bool:
    """
    Simulate Pi wallet authentication.

    Args:
        wallet_address (str): User's Pi wallet address.
        signature (str): Signature to validate.

    Returns:
        bool: True if wallet address and signature are valid.
    """
    # Replace this check with Pi Network SDK validation when ready.
    return wallet_address.startswith("pi_") and bool(signature)
