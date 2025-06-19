from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.players import PlayerCreate, PlayerUpdate, PlayerRead
from app.dependencies import get_supabase
from supabase import Client

router = APIRouter(
    prefix="/players",
    tags=["players"],
)

@router.get("/", response_model=List[PlayerRead])
def list_players(skip: int = 0, limit: int = 20, supabase: Client = Depends(get_supabase)):
    """
    List all players with pagination.
    """
    result = supabase.table("players").select("*").range(skip, skip + limit - 1).execute()
    if result.error:
        raise HTTPException(status_code=500, detail="Failed to fetch players.")
    return result.data

@router.post("/", response_model=PlayerRead, status_code=status.HTTP_201_CREATED)
def create_player(player: PlayerCreate, supabase: Client = Depends(get_supabase)):
    """
    Register a new player.
    """
    data = player.dict()
    result = supabase.table("players").insert(data).single().execute()
    if result.error:
        raise HTTPException(status_code=400, detail=str(result.error))
    return result.data

@router.get("/{player_id}", response_model=PlayerRead)
def get_player(player_id: int, supabase: Client = Depends(get_supabase)):
    """
    Retrieve a player by ID.
    """
    result = supabase.table("players").select("*").eq("id", player_id).single().execute()
    if result.error or result.data is None:
        raise HTTPException(status_code=404, detail="Player not found.")
    return result.data

@router.put("/{player_id}", response_model=PlayerRead)
def update_player(player_id: int, player_update: PlayerUpdate, supabase: Client = Depends(get_supabase)):
    """
    Update an existing player.
    """
    data = {k: v for k, v in player_update.dict().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    result = supabase.table("players").update(data).eq("id", player_id).single().execute()
    if result.error or result.data is None:
        raise HTTPException(status_code=404, detail="Player not found or update failed.")
    return result.data

@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(player_id: int, supabase: Client = Depends(get_supabase)):
    """
    Delete a player by ID.
    """
    result = supabase.table("players").delete().eq("id", player_id).execute()
    if result.error or (isinstance(result.data, list) and len(result.data) == 0):
        raise HTTPException(status_code=404, detail="Player not found or delete failed.")
    return
