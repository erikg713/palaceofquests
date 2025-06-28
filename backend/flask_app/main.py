import os
from datetime import datetime, timedelta, timezone
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response, abort, Blueprint
from jose import jwt, JWTError
import httpx
from supabase import create_client
import logging

# === Load configuration from environment ===
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_me")
PI_VERIFICATION_URL = "https://api.minepi.com/v2/me"
JWT_ALGORITHM = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 7  # 7 days

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase configuration is missing. Please check your environment variables.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# === Flask App Initialization ===
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# === Logging ===
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === Utility Functions ===

def create_session_token(user):
    """Create a JWT session token for a user."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES)
    payload = {
        "sub": user["username"],
        "user": user,
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_session_token(token):
    """Decode a JWT session token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("user")
    except JWTError as e:
        logger.warning(f"Token decode failed: {e}")
        return None

def get_token_from_cookie():
    """Retrieve session token from cookie."""
    return request.cookies.get("session_token")

def login_required(f):
    """Decorator to ensure user is authenticated via session token."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = get_token_from_cookie()
        user = decode_session_token(token) if token else None
        if not user:
            return jsonify({"detail": "Not authenticated"}), 401
        return f(user, *args, **kwargs)
    return decorated_function

# === Routes ===

@app.route("/", methods=["GET"])
def index():
    """Root endpoint for health check."""
    return jsonify({"message": "Welcome to Palace of Quests"})

@app.route("/api/pi-login", methods=["POST"])
def pi_login():
    """
    Authenticate user with Pi Network and create/update user in Supabase.
    Sets a secure session token cookie on successful login.
    """
    data = request.get_json()
    access_token = data.get("access_token") if data else None
    if not access_token:
        return jsonify({"detail": "Missing access_token"}), 400

    try:
        with httpx.Client(timeout=10) as client:
            resp = client.get(
                PI_VERIFICATION_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
    except httpx.RequestError as exc:
        logger.error(f"Pi API error: {exc}")
        return jsonify({"detail": "Failed to reach Pi Network API"}), 502

    if resp.status_code != 200:
        return jsonify({"detail": "Invalid Pi token"}), 401

    pi_user = resp.json()
    username = pi_user.get("username")
    if not username:
        return jsonify({"detail": "Username not found in Pi response"}), 400

    user_data = {
        "username": username,
        "pi_id": pi_user.get("uid"),
        "profile": pi_user,
        "last_login": datetime.now(timezone.utc).isoformat()
    }

    try:
        supabase.table("users").upsert(user_data, on_conflict=["username"]).execute()
    except Exception as e:
        logger.error(f"Supabase upsert failed: {e}")
        return jsonify({"detail": "Database error"}), 500

    session_token = create_session_token(user_data)
    resp = make_response(jsonify({"user": {"username": username}}))
    resp.set_cookie(
        "session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=60 * 60 * 24 * 7
    )
    return resp

@app.route("/api/session", methods=["GET"])
def get_session():
    """Retrieve the current user's session from the session token cookie."""
    token = get_token_from_cookie()
    user = decode_session_token(token) if token else None
    if not user:
        return jsonify({"user": None})
    return jsonify({"user": {"username": user["username"]}})

@app.route("/api/logout", methods=["POST"])
def logout():
    """Log out the current user by deleting the session token cookie."""
    resp = make_response(jsonify({"message": "Logged out"}))
    resp.delete_cookie("session_token")
    return resp

# === Register Blueprints for players and quests APIs if available ===
try:
    from app.routes.players import players_bp
    from app.routes.quests import quests_bp
    app.register_blueprint(players_bp, url_prefix="/api/players")
    app.register_blueprint(quests_bp, url_prefix="/api/quests")
except ImportError:
    logger.info("Players and Quests blueprints not registered (modules missing).")

# === End of File ===
