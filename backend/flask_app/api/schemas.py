import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, Response
from app.schemas.players import PlayerCreate, PlayerUpdate, PlayerRead
from app.dependencies import get_supabase
from supabase import Client

logger = logging.getLogger("api.schemas")

router = APIRouter(prefix="/players", tags=["players"])

MAX_LIMIT = 100

class PlayerRepository:
    def __init__(self, supabase: Client):
        self._table = supabase.table("players")

    async def list(self, skip: int, limit: int):
        return await self._table.select("id, name, age").range(skip, skip + limit - 1).execute()

    async def create(self, player: PlayerCreate):
        return await self._table.insert(player.dict()).single().execute()

    async def get(self, player_id: int):
        return await self._table.select("id, name, age").eq("id", player_id).single().execute()

    async def update(self, player_id: int, update_data: dict):
        return await self._table.update(update_data).eq("id", player_id).single().execute()

    async def delete(self, player_id: int):
        return await self._table.delete().eq("id", player_id).execute()

def get_repository(supabase: Client = Depends(get_supabase)) -> PlayerRepository:
    return PlayerRepository(supabase)

def handle_db_error(exc: Exception, msg: str, status_code: int = 500):
    logger.exception(f"{msg}: {exc}")
    raise HTTPException(status_code=status_code, detail=msg)

@router.get(
    "/", 
    response_model=List[PlayerRead], 
    summary="List all players",
    response_description="A paginated list of players"
)
async def list_players(
    skip: int = Query(0, ge=0, description="Records to skip"),
    limit: int = Query(20, ge=1, le=MAX_LIMIT, description="Max records to return"),
    repo: PlayerRepository = Depends(get_repository),
):
    """
    Retrieve a paginated list of players.
    """
    try:
        result = await repo.list(skip, limit)
    except Exception as exc:
        handle_db_error(exc, "Server error while fetching players")
    if result.error:
        logger.error("Supabase error fetching players: %s", result.error)
        raise HTTPException(status_code=500, detail="Failed to fetch players.")
    return result.data or []

@router.post(
    "/", 
    response_model=PlayerRead, 
    status_code=status.HTTP_201_CREATED, 
    summary="Register a new player"
)
async def create_player(
    player: PlayerCreate,
    repo: PlayerRepository = Depends(get_repository),
):
    """
    Register a new player in the system.
    """
    try:
        result = await repo.create(player)
    except Exception as exc:
        handle_db_error(exc, "Server error while creating player")
    if result.error or not result.data:
        logger.error("Supabase error creating player: %s", result.error)
        raise HTTPException(status_code=400, detail="Unable to create player.")
    return result.data

@router.get(
    "/{player_id}", 
    response_model=PlayerRead, 
    summary="Get player by ID"
)
async def get_player(
    player_id: int = Path(..., ge=1, description="Player ID"),
    repo: PlayerRepository = Depends(get_repository),
):
    """
    Retrieve a specific player by ID.
    """
    try:
        result = await repo.get(player_id)
    except Exception as exc:
        handle_db_error(exc, f"Server error while retrieving player {player_id}")
    if result.error or not result.data:
        logger.warning("Player not found: %d", player_id)
        raise HTTPException(status_code=404, detail=f"Player with ID {player_id} not found.")
    return result.data

@router.put(
    "/{player_id}", 
    response_model=PlayerRead, 
    summary="Update a player"
)
async def update_player(
    player_id: int = Path(..., ge=1, description="Player ID"),
    player_update: PlayerUpdate = ...,
    repo: PlayerRepository = Depends(get_repository),
):
    """
    Update an existing player's information.
    Only non-null fields will be updated.
    """
    update_data = player_update.dict(exclude_unset=True)
    if not update_data:
        logger.warning("No fields provided for updating player %d", player_id)
        raise HTTPException(status_code=400, detail="No fields to update.")
    try:
        result = await repo.update(player_id, update_data)
    except Exception as exc:
        handle_db_error(exc, f"Server error while updating player {player_id}")
    if result.error or not result.data:
        logger.error("Failed to update player %d: %s", player_id, result.error)
        raise HTTPException(status_code=404, detail="Player not found or update failed.")
    return result.data

@router.delete(
    "/{player_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a player"
)
async def delete_player(
    player_id: int = Path(..., ge=1, description="Player ID"),
    repo: PlayerRepository = Depends(get_repository),
):
    """
    Delete a player by ID.
    """
    try:
        result = await repo.delete(player_id)
    except Exception as exc:
        handle_db_error(exc, f"Server error while deleting player {player_id}")
    if result.error or not (result.data and len(result.data) > 0):
        logger.warning("Delete failed for player %d: %s", player_id, result.error)
        raise HTTPException(status_code=404, detail="Player not found or delete failed.")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
