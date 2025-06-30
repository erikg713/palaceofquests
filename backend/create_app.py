from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register all blueprints here
    from routes.game_routes import game_bp
    app.register_blueprint(game_bp, url_prefix="/api/game")

    return app
import os
import logging
from flask import Flask
from flask_cors import CORS
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
from supabase import create_client
from app.routes.pi_routes import pi_bp
from flask_app.routes.pi_wallet import pi_wallet_bp

load_dotenv()

# Initialize Supabase client globally
def initialize_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")  # Use SERVICE_ROLE_KEY for admin access if needed
    if not url or not key:
        raise EnvironmentError("Supabase URL or Key not set.")
    return create_client(url, key)

supabase = initialize_supabase()  # You can import this globally from elsewhere

def create_app() -> Flask:
    """
    Flask app factory with CORS, logging, Supabase, blueprints.
    """
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY", "supersecret")

    # --- Logging Setup ---
    handler = RotatingFileHandler("app.log", maxBytes=100000, backupCount=3)
    handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    logger = logging.getLogger()
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

    # --- Config ---
    config_file = os.getenv("FLASK_CONFIG_FILE", "config.py")
    try:
        app.config.from_pyfile(config_file)
    except FileNotFoundError:
        logging.warning("No config.py found, using defaults.")
        app.config["DEBUG"] = os.getenv("FLASK_DEBUG", True)

    # --- CORS ---
    cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    logging.info(f"CORS origins: {cors_origins}")

    # --- Blueprints ---
    try:
        app.register_blueprint(pi_bp, url_prefix="/api/pi")
        app.register_blueprint(pi_wallet_bp, url_prefix="/api/wallet")
        logging.info("Blueprints registered.")
    except Exception as e:
        logging.error(f"Blueprint registration error: {e}")
        raise

    return app
