import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, Response, HTTPException, Depends, Cookie, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import create_client, Client
from jose import jwt, JWTError
import httpx

from app.routes import players, quests
from app.api import auth, users

# === Configuration ===
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_me")
PI_VERIFICATION_URL = "https://api.minepi.com/v2/me"
JWT_ALGORITHM = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 7  # 7 days

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase configuration is missing. Please check your environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# === FastAPI App Initialization ===
app = FastAPI(
    title="Palace of Quests API",
    description="API for Palace of Quests game backend.",
    version="1.0.0"
)

# === Routers ===
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(quests.router, prefix="/api/quests", tags=["Quests"])

# === Models ===
class PiLoginRequest(BaseModel):
    access_token: str

# === Utility Functions ===
def create_session_token(user: Dict[str, Any]) -> str:
    """Create a JWT session token for a user."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXP_MINUTES)
    payload = {
        "sub": user["username"],
        "user": user,
        "exp": int(expire.timestamp())
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_session_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode a JWT session token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("user")
    except JWTError:
        return None

def get_token_from_cookie(session_token: Optional[str] = Cookie(None)) -> Optional[str]:
    """Retrieve session token from cookie."""
    return session_token

# === Auth Dependency ===
def require_login(token: Optional[str] = Depends(get_token_from_cookie)) -> Dict[str, Any]:
    """Dependency to ensure user is authenticated."""
    user = decode_session_token(token) if token else None
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user

# === Endpoints ===
@app.get("/", tags=["Root"])
async def index():
    """Root endpoint for health check."""
    return {"message": "Welcome to Palace of Quests"}

@app.post("/api/pi-login", tags=["Authentication"])
async def pi_login(data: PiLoginRequest, response: Response):
    """
    Authenticate user with Pi Network and create/update user in Supabase.
    Sets a secure session token cookie on successful login.
    """
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            PI_VERIFICATION_URL,
            headers={"Authorization": f"Bearer {data.access_token}"}
        )

    if resp.status_code != status.HTTP_200_OK:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Pi token")
    pi_user = resp.json()
    username = pi_user.get("username")
    if not username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username not found in Pi response")

    user_data = {
        "username": username,
        "pi_id": pi_user.get("uid"),
        "profile": pi_user,
        "last_login": datetime.now(timezone.utc).isoformat()
    }
    # Upsert user record in Supabase
    supabase.table("users").upsert(user_data, on_conflict=["username"]).execute()

    session_token = create_session_token(user_data)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )
    return {"user": {"username": username}}

@app.get("/api/session", tags=["Authentication"])
async def get_session(token: Optional[str] = Depends(get_token_from_cookie)):
    """
    Retrieve the current user's session from the session token cookie.
    """
    if not token:
        return JSONResponse({"user": None})
    user = decode_session_token(token)
    if not user:
        return JSONResponse({"user": None})
    return {"user": {"username": user["username"]}}

@app.post("/api/logout", tags=["Authentication"])
async def logout(response: Response):
    """
    Log out the current user by deleting the session token cookie.
    """
    response.delete_cookie("session_token")
    return {"message": "Logged out"}

# === End of File ===
