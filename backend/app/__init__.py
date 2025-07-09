"""
Palace of Quests Flask Application Factory
"""

from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt, migrate, ma
from app.config import Config

def create_app(config_class=Config):
    """Create and configure Flask application"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    
    # Configure CORS
    CORS(app, origins=["http://localhost:3000", "https://palace-of-quests.vercel.app"])
    
    # Register blueprints
    from app.api.auth import bp as auth_bp
    from app.api.users import bp as users_bp
    from app.api.quests import bp as quests_bp
    from app.api.marketplace import bp as marketplace_bp
    from app.api.transactions import bp as transactions_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(quests_bp, url_prefix='/api/quests')
    app.register_blueprint(marketplace_bp, url_prefix='/api/marketplace')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {
            'status': 'healthy',
            'service': 'Palace of Quests API',
            'version': '1.0.0'
        }
    
    # Error handlers
    from app.utils.errors import register_error_handlers
    register_error_handlers(app)
    
    return app
