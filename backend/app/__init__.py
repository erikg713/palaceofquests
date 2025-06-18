from flask import Flask
from app.routes.pi_routes import pi_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(pi_bp, url_prefix="/api/pi")
    return app
