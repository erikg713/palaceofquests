from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import supabase

router = APIRouter()

class QuestCreate(BaseModel):
    wallet_address: str
    quest_name: str

@router.post("/")
def complete_quest(data: QuestCreate):
    # Check if player exists
    player = supabase.table("players").select("*").eq("wallet_address", data.wallet_address).single().execute()
    if not player.data:
        raise HTTPException(status_code=404, detail="Player not found")

    quest = supabase.table("quests").insert({
        "player_id": player.data["id"],
        "quest_name": data.quest_name
    }).execute()

    return {"message": "Quest completed", "quest": quest.data}

