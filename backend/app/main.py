from fastapi import FastAPI
from app.routes import players, quests, dao

app = FastAPI(title="Palace of Quests API")

app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(quests.router, prefix="/api/quests", tags=["Quests"])
app.include_router(dao.router, prefix="/api/dao", tags=["DAO Voting"])

@app.get("/")
def index():
    return {"message": "Welcome to Palace of Quests API"}

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
