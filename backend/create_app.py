from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register all blueprints here
    from routes.game_routes import game_bp
    app.register_blueprint(game_bp, url_prefix="/api/game")

    return app
