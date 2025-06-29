from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field, ValidationError
from app.db import get_supabase_client
import logging

# Initialize router and logging
router = APIRouter()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Models
class QuestCreate(BaseModel):
    wallet_address: str = Field(..., min_length=42, max_length=42, description="Ethereum wallet address")
    quest_name: str = Field(..., min_length=1, max_length=100)

# Database operations
def get_player_by_wallet(wallet_address: str, supabase_client):
    player = supabase_client.table("players").select("*").eq("wallet_address", wallet_address).single().execute()
    if not player.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with wallet {wallet_address} not found")
    return player.data

def add_quest(player_id: int, quest_name: str, supabase_client):
    result = supabase_client.table("quests").insert({
        "player_id": player_id,
        "quest_name": quest_name
    }).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to insert quest")
    return result.data

# Routes
@router.post("/", status_code=status.HTTP_201_CREATED)
def complete_quest(data: QuestCreate, supabase_client=Depends(get_supabase_client)):
    """
    Mark a quest as completed for a player.
    """
    try:
        # Validate player and add quest
        player = get_player_by_wallet(data.wallet_address, supabase_client)
        quest = add_quest(player["id"], data.quest_name, supabase_client)
        
        # Log and return response
        logger.info(f"Quest '{data.quest_name}' completed for player {player['id']}")
        return {"message": "Quest completed", "quest": quest}
    
    except ValidationError as exc:
        logger.warning(f"Validation error: {exc}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid input")
    
    except HTTPException as exc:
        logger.warning(f"Quest completion failed: {exc.detail}")
        raise
    
    except Exception as exc:
        logger.error(f"Internal server error: {exc}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
