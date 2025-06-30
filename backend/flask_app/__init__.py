import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from logging.handlers import RotatingFileHandler
from .config import Config
from app.routes.pi_routes import pi_bp
from supabase import create_client
from flask_app.routes.pi_wallet import pi_wallet_bp
from flask import Flask
from flask_app.routes.pi_wallet import pi_wallet_bp
from dotenv import load_dotenv
load_dotenv()
def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY', 'change-this')
    app.register_blueprint(pi_wallet_bp)
    return app
    
def create_app():
    app = Flask(__name__)
    # ... other config ...
    app.register_blueprint(pi_wallet_bp)
    return app
    
# Initialize Supabase
def initialize_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise EnvironmentError("Supabase URL or Key not set in environment variables.")
    return create_client(url, key)

db = initialize_supabase()

def create_app() -> Flask:
    """
    Factory function to create and configure the Flask application.

    Returns:
        Flask: The configured Flask application instance.
    """
    # Create Flask application instance
    app = Flask(__name__)

    # Configure logging
    handler = RotatingFileHandler("app.log", maxBytes=100000, backupCount=3)
    handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
    logger = logging.getLogger()
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

    # Load configurations
    config_file = os.getenv("FLASK_CONFIG_FILE", "config.py")
    try:
        app.config.from_pyfile(config_file)
    except FileNotFoundError:
        logging.warning("Configuration file not found. Using default settings.")
        app.config["DEBUG"] = os.getenv("FLASK_DEBUG", True)

    # Enable CORS with restricted origins
    cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    logging.info(f"CORS configured with origins: {cors_origins}")

    # Initialize database
    try:
        db.init_app(app)
        logging.info("Database initialized successfully.")
    except Exception as e:
        logging.critical("Database could not be initialized. Exiting application.")
        raise SystemExit(e)

    # Register blueprints
    def register_blueprints(app):
        blueprints = [
            (pi_bp, "/api/pi"),
            # Add other blueprints as tuples here
        ]
        for blueprint, prefix in blueprints:
            try:
                app.register_blueprint(blueprint, url_prefix=prefix)
                logging.info(f"Blueprint '{blueprint.name}' registered successfully.")
            except Exception as e:
                logging.error(f"Error registering blueprint '{blueprint.name}': {e}")
                raise

    register_blueprints(app)

    # Return the app instance
    return app
