from flask import Flask
from app.routes.pi_routes import pi_bp
import logging

def create_app() -> Flask:
    """
    Factory function to create and configure the Flask application.

    Returns:
        Flask: The configured Flask application instance.
    """
    # Create Flask application instance
    app = Flask(__name__)
    
    # Load configurations
    try:
        app.config.from_pyfile("config.py")
    except FileNotFoundError:
        logging.warning("Configuration file not found. Using default settings.")
        app.config["DEBUG"] = True  # Default configuration
    
    # Register blueprints
    try:
        app.register_blueprint(pi_bp, url_prefix="/api/pi")
        logging.info("Blueprint 'pi_bp' registered successfully.")
    except Exception as e:
        logging.error(f"Error registering blueprint 'pi_bp': {e}")
        raise
    
    # Return the app instance
    return app


from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    from .routes.auth import auth_bp
    from .routes.quests import quests_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(quests_bp, url_prefix="/api/quests")

    return app
