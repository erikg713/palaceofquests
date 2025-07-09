"""
Flask extensions initialization
"""

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
ma = Marshmallow()
