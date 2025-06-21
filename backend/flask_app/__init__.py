import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from app.routes.pi_routes import pi_bp

db = Supabase()  # Ensure Supabase is properly initialized elsewhere

def create_app() -> Flask:
    """
    Factory function to create and configure the Flask application.

    Returns:
        Flask: The configured Flask application instance.
    """
    # Create Flask application instance
    app = Flask(__name__)

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Load configurations
    config_file = os.getenv("FLASK_CONFIG_FILE", "config.py")
    try:
        app.config.from_pyfile(config_file)
    except FileNotFoundError:
        logging.warning("Configuration file not found. Using default settings.")
        app.config["DEBUG"] = os.getenv("FLASK_DEBUG", True)  # Default configuration

    # Enable CORS with restricted origins
    CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ALLOWED_ORIGINS", "*")}})

    # Initialize database
    try:
        db.init_app(app)
        logging.info("Database initialized successfully.")
    except Exception as e:
        logging.error(f"Error initializing database: {e}")
        raise

    # Register blueprints
    try:
        app.register_blueprint(pi_bp, url_prefix="/api/pi")
        logging.info("Blueprint 'pi_bp' registered successfully.")
    except Exception as e:
        logging.error(f"Error registering blueprint 'pi_bp': {e}")
        raise

    # Return the app instance
    return app
