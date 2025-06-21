from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.db import supabase
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class QuestCreate(BaseModel):
    wallet_address: str = Field(..., min_length=42, max_length=42, description="Ethereum wallet address")
    quest_name: str = Field(..., min_length=1, max_length=100)

def get_player_by_wallet(wallet_address: str):
    player = supabase.table("players").select("*").eq("wallet_address", wallet_address).single().execute()
    if not player.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    return player.data

def add_quest(player_id: int, quest_name: str):
    result = supabase.table("quests").insert({
        "player_id": player_id,
        "quest_name": quest_name
    }).execute()
    return result.data

@router.post("/", status_code=201)
def complete_quest(data: QuestCreate):
    """
    Mark a quest as completed for a player.
    """
    try:
        player = get_player_by_wallet(data.wallet_address)
        quest = add_quest(player["id"], data.quest_name)
        logger.info(f"Quest '{data.quest_name}' completed for player {player['id']}")
        return {"message": "Quest completed", "quest": quest}
    except HTTPException as exc:
        logger.warning(f"Quest completion failed: {exc.detail}")
        raise
    except Exception as exc:
        logger.error(f"Internal error: {exc}")
        raise HTTPException(status_code=500, detail="Internal server error")
