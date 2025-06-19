from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_supabase  # Supabase client dependency
from supabase import Client

# --- Pydantic Schemas ---

class PlayerBase(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=32,
        regex="^[a-zA-Z0-9_]+$",
        example="adventurer42",
        description="Unique username for the player. Alphanumeric and underscores only."
    )
    email: EmailStr = Field(
        ...,
        example="hero@example.com",
        description="Email address for the player."
    )

class PlayerCreate(PlayerBase):
    # If authentication is needed, uncomment the password field and add suitable validation
    # password: str = Field(..., min_length=8, example="strongpassword123")
    pass

class PlayerUpdate(BaseModel):
    username: Optional[str] = Field(
        None,
        min_length=3,
        max_length=32,
        regex="^[a-zA-Z0-9_]+$",
        example="newhero"
    )
    email: Optional[EmailStr] = Field(
        None,
        example="newhero@example.com"
    )
    # Add more optional fields as needed

class PlayerRead(PlayerBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- API Router ---

router = APIRouter(
    prefix="/players",
    tags=["players"]
)

@router.get("/", response_model=List[PlayerRead])
def list_players(
    skip: int = 0,
    limit: int = 20,
    supabase: Client = Depends(get_supabase)
):
    """
    Retrieve a paginated list of players.
    """
    result = supabase.table("players").select("*").range(skip, skip + limit - 1).execute()
    if result.error:
        raise HTTPException(status_code=500, detail=f"Failed to fetch players: {result.error}")
    return result.data

@router.post("/", response_model=PlayerRead, status_code=status.HTTP_201_CREATED)
def create_player(
    player: PlayerCreate,
    supabase: Client = Depends(get_supabase)
):
    """
    Create a new player.
    """
    data = player.dict()
    result = supabase.table("players").insert(data).single().execute()
    if result.error:
        raise HTTPException(status_code=400, detail=f"Error creating player: {result.error}")
    return result.data

@router.get("/{player_id}", response_model=PlayerRead)
def get_player(
    player_id: int,
    supabase: Client = Depends(get_supabase)
):
    """
    Retrieve player details by ID.
    """
    result = supabase.table("players").select("*").eq("id", player_id).single().execute()
    if result.error or not result.data:
        raise HTTPException(status_code=404, detail=f"Player with ID {player_id} not found.")
    return result.data

@router.put("/{player_id}", response_model=PlayerRead)
def update_player(
    player_id: int,
    player_update: PlayerUpdate,
    supabase: Client = Depends(get_supabase)
):
    """
    Update a player's information by ID.
    """
    data = {k: v for k, v in player_update.dict(exclude_unset=True).items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields provided for update.")
    result = supabase.table("players").update(data).eq("id", player_id).single().execute()
    if result.error or not result.data:
        raise HTTPException(status_code=404, detail=f"Player with ID {player_id} not found or update failed.")
    return result.data

@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(
    player_id: int,
    supabase: Client = Depends(get_supabase)
):
    """
    Delete a player by ID.
    """
    result = supabase.table("players").delete().eq("id", player_id).execute()
    if result.error or (isinstance(result.data, list) and not result.data):
        raise HTTPException(status_code=404, detail=f"Player with ID {player_id} not found or delete failed.")
    return
