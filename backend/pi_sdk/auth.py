import base64
import json
import requests
import time
from flask import current_app

# Dummy function to simulate Pi Network JWT verification
def verify_user(identity_payload: str, signature: str) -> dict:
    """
    Verifies the JWT identity payload sent from the Pi frontend SDK.
    (You’ll replace this with real Pi Network validation once available.)
    """
    try:
        payload_data = json.loads(base64.b64decode(identity_payload).decode("utf-8"))
        username = payload_data.get("user", {}).get("username")

        # Optional: validate timestamp, nonce, etc.
        if not username:
            raise ValueError("Invalid payload")

        # Simulate signature check here (mocked)
        if not signature or len(signature) < 10:
            raise ValueError("Invalid signature")

        return {
            "username": username,
            "payload": payload_data,
        }
    except Exception as e:
        raise ValueError(f"Authentication failed: {str(e)}")

