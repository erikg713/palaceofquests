from flask import Blueprint, request, jsonify
from ..models.user import User, db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(pi_username=data["username"]).first()
    if not user:
        user = User(pi_username=data["username"])
        db.session.add(user)
        db.session.commit()
    return jsonify({"message": "Logged in", "user_id": user.id})
