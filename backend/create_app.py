import os
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client

from app.routes.pi_routes import pi_bp
from flask_app.routes.pi_wallet import pi_wallet_bp

load_dotenv()


def get_env_var(name: str, default=None, required=False) -> str:
    """Fetch and validate environment variables."""
    value = os.getenv(name, default)
    if required and value is None:
        raise EnvironmentError(f"Missing required environment variable: {name}")
    return value


def init_supabase():
    """Initialize Supabase client using environment variables."""
    url = get_env_var("SUPABASE_URL", required=True)
    key = get_env_var("SUPABASE_KEY", required=True)
    return create_client(url, key)


def setup_logging(logfile: str = "app.log"):
    """Configure application logging."""
    handler = RotatingFileHandler(logfile, maxBytes=100_000, backupCount=3)
    handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    logger = logging.getLogger()
    logger.handlers.clear()
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


def register_blueprints(app: Flask):
    """Register all Flask blueprints."""
    app.register_blueprint(pi_bp, url_prefix="/api/pi")
    app.register_blueprint(pi_wallet_bp, url_prefix="/api/wallet")
    logging.info("Blueprints registered: /api/pi, /api/wallet")


def create_app() -> Flask:
    """Application factory for Flask app."""
    setup_logging()
    supabase = init_supabase()

    app = Flask(__name__)
    app.secret_key = get_env_var("SECRET_KEY", default="supersecret")
    
    config_file = get_env_var("FLASK_CONFIG_FILE", default=None)
    if config_file:
        try:
            app.config.from_pyfile(config_file)
        except FileNotFoundError:
            logging.warning(f"Config file '{config_file}' not found. Using default settings.")
    else:
        app.config["DEBUG"] = get_env_var("FLASK_DEBUG", default="1") == "1"

    cors_origins = get_env_var("CORS_ALLOWED_ORIGINS", default="*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    logging.info(f"CORS enabled for origins: {cors_origins}")

    register_blueprints(app)

    return app
