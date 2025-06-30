import os
import uuid
import logging
from typing import Any, Dict
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import load_dotenv
from marshmallow import Schema, fields, ValidationError
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Load environment variables first
load_dotenv()

# --- Configuration ---
REQUIRED_ENV_VARS = ("PI_API_KEY", "SUPABASE_URL", "SUPABASE_KEY")
missing = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
if missing:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

PI_API_KEY = os.environ["PI_API_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

# --- Logging ---
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s")
logger = logging.getLogger("palaceofquests.backend")

# --- Flask Factory ---
def create_app():
    app = Flask(__name__)
    app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False

    # Set CORS from env, fallback to localhost for dev
    origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    # Register blueprints here
    from backend.routes.game_routes import game_bp
    from backend.routes.auth_routes import auth_bp
    app.register_blueprint(game_bp)
    app.register_blueprint(auth_bp)

    # Error handlers
    @app.errorhandler(ValidationError)
    def handle_validation_error(err):
        return jsonify({"error": err.messages}), 400

    @app.errorhandler(Exception)
    def handle_general_error(err):
        logger.error("Unhandled error: %s", err)
        return jsonify({"error": str(err)}), 500

    # Health check
    @app.route("/", methods=["GET"])
    def health():
        return jsonify({"status": "Backend running"})

    # Payment routes (inline here; ideally, move to blueprint)
    # ... (your payment endpoints, as refactored below) ...

    return app

# --- HTTP Session with Retries ---
def get_session() -> requests.Session:
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        status_forcelist=[429, 500, 502, 503, 504],
        backoff_factor=1,
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

SESSION = get_session()
DEFAULT_TIMEOUT = 5

# --- Utility Functions (no changes needed) ---

# --- Marshmallow Schemas (no changes needed) ---

# --- Main Entrypoint ---
if __name__ == "__main__":
    port = int(os.getenv("PORT", 4000))
    app = create_app()
    app.run(host="0.0.0.0", port=port)
