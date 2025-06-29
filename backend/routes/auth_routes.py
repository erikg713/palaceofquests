# backend/routes/auth_routes.py
from flask import Blueprint, request, jsonify
import requests
import jwt
from app.models import db, User
from app.config import settings

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/pi-login", methods=["POST"])
def pi_login():
    data = request.json
    access_token = data.get("accessToken")
    user_uid = data.get("user").get("uid")

    # Verify Pi token with Pi server
    headers = {"Authorization": f"Bearer {access_token}"}
    r = requests.get("https://api.minepi.com/me", headers=headers)
    if r.status_code != 200 or r.json().get("uid") != user_uid:
        return jsonify({"error": "Invalid Pi login"}), 401

    # Create user if doesn't exist
    user = User.query.get(user_uid)
    if not user:
        user = User(id=user_uid, username=data["user"]["username"])
        db.session.add(user)
        db.session.commit()

    # Create JWT token
    token = jwt.encode({"user_id": user.id}, settings.JWT_SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token})

