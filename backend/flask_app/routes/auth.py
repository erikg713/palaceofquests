from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import SQLAlchemyError
from marshmallow import Schema, fields, ValidationError
import logging
from ..models.user import User, db

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Blueprint
auth_bp = Blueprint("auth", __name__)

# Define Schema
class LoginSchema(Schema):
    username = fields.Str(required=True)

login_schema = LoginSchema()

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Handle user login.

    Request Body:
        - username (str): The username of the user trying to log in.

    Returns:
        - JSON response with a message and either an access token or an error message.
    """
    try:
        # Validate input
        data = login_schema.load(request.json)

        # Check if user exists
        user = User.query.filter_by(pi_username=data["username"]).first()
        if not user:
            # Create new user if not exists
            user = User(pi_username=data["username"])
            db.session.add(user)
            db.session.commit()
            logger.info(f"New user created: {user.id}")

        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        logger.info(f"User {user.id} logged in successfully")
        return jsonify({"message": "Logged in", "access_token": access_token})

    except ValidationError as err:
        logger.warning(f"Validation error: {err.messages}")
        return jsonify({"error": err.messages}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
