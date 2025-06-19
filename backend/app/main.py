from fastapi import FastAPI
from app.routes import players, quests
from app.api import auth, users

app = FastAPI()
app.include_router(auth.router)
app.include_router(users.router)
app = FastAPI(title="Palace of Quests API")

app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(quests.router, prefix="/api/quests", tags=["Quests"])

@app.get("/")
def index():
    return {"message": "Welcome to Palace of Quests"}

from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

PI_VERIFICATION_URL = "https://api.minepi.com/v2/me"

class PiLoginRequest(BaseModel):
    access_token: str

@app.post("/api/pi-login")
async def pi_login(data: PiLoginRequest):
    # 1. Verify the Pi access token
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            PI_VERIFICATION_URL,
            headers={"Authorization": f"Bearer {data.access_token}"}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Pi token")

        pi_user = resp.json()
        username = pi_user.get("username")
        if not username:
            raise HTTPException(status_code=400, detail="Username not found in Pi response")

    # 2. Store or update user in Supabase
    user_data = {
        "username": username,
        "pi_id": pi_user.get("uid"),
        "profile": pi_user,
    }
    # Upsert user (insert or update)
    supabase.table("users").upsert(user_data, on_conflict=["username"]).execute()

    return {"username": username}
import os
import httpx
from fastapi import FastAPI, Request, Response, HTTPException, Depends, status, Cookie
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import create_client, Client
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PI_VERIFICATION_URL = "https://api.minepi.com/v2/me"
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_me")
JWT_ALGORITHM = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 7  # 7 days

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
app = FastAPI()

class PiLoginRequest(BaseModel):
    access_token: str

def create_session_token(user: dict):
    payload = {
        "sub": user["username"],
        "user": user,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_session_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["user"]
    except JWTError:
        return None

def get_token_from_cookie(session_token: str = Cookie(None)):
    return session_token

@app.post("/api/pi-login")
async def pi_login(data: PiLoginRequest, response: Response):
    # 1. Verify Pi access token
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            PI_VERIFICATION_URL,
            headers={"Authorization": f"Bearer {data.access_token}"}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Pi token")
        pi_user = resp.json()
        username = pi_user.get("username")
        if not username:
            raise HTTPException(status_code=400, detail="Username not found in Pi response")

    # 2. Upsert user info in Supabase
    user_data = {
        "username": username,
        "pi_id": pi_user.get("uid"),
        "profile": pi_user,
        "last_login": datetime.utcnow().isoformat()
    }
    supabase.table("users").upsert(user_data, on_conflict=["username"]).execute()

    # 3. Issue session token (JWT)
    session_token = create_session_token(user_data)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return {"user": {"username": username}}

@app.get("/api/session")
async def get_session(token: str = Depends(get_token_from_cookie)):
    if not token:
        return JSONResponse({"user": None})
    user = decode_session_token(token)
    if not user:
        return JSONResponse({"user": None})
    return {"user": {"username": user["username"]}}

@app.post("/api/logout")
async def logout(response: Response):
    response.delete_cookie("session_token")
    return {"message": "Logged out"}

# Optional: Dependency to require login
def require_login(token: str = Depends(get_token_from_cookie)):
    user = decode_session_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
