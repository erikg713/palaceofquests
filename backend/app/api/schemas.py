import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.schemas.players import PlayerCreate, PlayerUpdate, PlayerRead
from app.dependencies import get_supabase
from supabase import Client

logger = logging.getLogger("api.schemas")
router = APIRouter(prefix="/players", tags=["players"])
MAX_LIMIT = 100

@router.get("/", response_model=List[PlayerRead], summary="List all players")
def list_players(
    skip: int = 0,
    limit: int = 20,
    supabase: Client = Depends(get_supabase)
) -> List[PlayerRead]:
    """
    Retrieve a paginated list of players.
    """
    limit = max(1, min(limit, MAX_LIMIT))
    try:
        result = supabase.table("players").select("id, name, age").range(skip, skip + limit - 1).execute()
    except Exception as exc:
        logger.exception("Critical error while fetching players: %s", exc)
        raise HTTPException(status_code=500, detail="Server error while fetching players.")
    if result.error:
        logger.error("Supabase error fetching players: %s", result.error)
        raise HTTPException(status_code=500, detail="Failed to fetch players.")
    return result.data or []

@router.post("/", response_model=PlayerRead, status_code=status.HTTP_201_CREATED, summary="Register a new player")
def create_player(
    player: PlayerCreate,
    supabase: Client = Depends(get_supabase)
) -> PlayerRead:
    """
    Register a new player in the system.
    """
    try:
        result = supabase.table("players").insert(player.dict()).single().execute()
    except Exception as exc:
        logger.exception("Critical error while creating player: %s", exc)
        raise HTTPException(status_code=500, detail="Server error while creating player.")
    if result.error or not result.data:
        logger.error("Supabase error creating player: %s", result.error)
        raise HTTPException(status_code=400, detail="Unable to create player.")
    return result.data

@router.get("/{player_id}", response_model=PlayerRead, summary="Get player by ID")
def get_player(
    player_id: int,
    supabase: Client = Depends(get_supabase)
) -> PlayerRead:
    """
    Retrieve a specific player by ID.
    """
    try:
        result = supabase.table("players").select("id, name, age").eq("id", player_id).single().execute()
    except Exception as exc:
        logger.exception("Critical error while retrieving player: %s", exc)
        raise HTTPException(status_code=500, detail="Server error while retrieving player.")
    if result.error or not result.data:
        logger.warning("Player not found: %d", player_id)
        raise HTTPException(status_code=404, detail="Player not found.")
    return result.data

@router.put("/{player_id}", response_model=PlayerRead, summary="Update a player")
def update_player(
    player_id: int,
    player_update: PlayerUpdate,
    supabase: Client = Depends(get_supabase)
) -> PlayerRead:
    """
    Update an existing player's information.
    """
    update_data = player_update.dict(exclude_unset=True)
    if not update_data:
        logger.warning("No fields provided for updating player %d", player_id)
        raise HTTPException(status_code=400, detail="No fields to update.")

    try:
        result = supabase.table("players").update(update_data).eq("id", player_id).single().execute()
    except Exception as exc:
        logger.exception("Critical error while updating player: %s", exc)
        raise HTTPException(status_code=500, detail="Server error while updating player.")

    if result.error or not result.data:
        logger.error("Failed to update player %d: %s", player_id, result.error)
        raise HTTPException(status_code=404, detail="Player not found or update failed.")
    return result.data

@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a player")
def delete_player(
    player_id: int,
    supabase: Client = Depends(get_supabase)
) -> Response:
    """
    Delete a player by ID.
    """
    try:
        result = supabase.table("players").delete().eq("id", player_id).execute()
    except Exception as exc:
        logger.exception("Critical error while deleting player: %s", exc)
        raise HTTPException(status_code=500, detail="Server error while deleting player.")

    # Supabase returns an empty list if nothing was deleted, or error if failed
    if result.error or not (result.data and len(result.data) > 0):
        logger.warning("Delete failed for player %d: %s", player_id, result.error)
        raise HTTPException(status_code=404, detail="Player not found or delete failed.")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
