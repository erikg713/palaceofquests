from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class PlayerBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=32, example="adventurer42")
    email: EmailStr = Field(..., example="hero@example.com")

class PlayerCreate(PlayerBase):
    pass  # Add fields like 'password' if needed

class PlayerUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=32, example="newhero")
    email: Optional[EmailStr] = Field(None, example="newhero@example.com")
    # Add more optional fields if your table has them

class PlayerRead(PlayerBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class PlayerBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=32, example="adventurer42")
    email: EmailStr = Field(..., example="hero@example.com")

class PlayerCreate(PlayerBase):
    pass  # Add fields like 'password' if needed

class PlayerUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=32, example="newhero")
    email: Optional[EmailStr] = Field(None, example="newhero@example.com")
    # Add more optional fields if your table has them

class PlayerRead(PlayerBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = Truefrom fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerRead
from app.dependencies import get_supabase  # Your supabase client dependency
from supabase import Client

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
    List players with pagination.
    """
    result = supabase.table("players").select("*").range(skip, skip + limit - 1).execute()
    if result.error:
        raise HTTPException(status_code=500, detail="Failed to fetch players.")
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
        raise HTTPException(status_code=400, detail=str(result.error))
    return result.data

@router.get("/{player_id}", response_model=PlayerRead)
def get_player(
    player_id: int, 
    supabase: Client = Depends(get_supabase)
):
    """
    Get a player by ID.
    """
    result = supabase.table("players").select("*").eq("id", player_id).single().execute()
    if result.error or result.data is None:
        raise HTTPException(status_code=404, detail="Player not found.")
    return result.data

@router.put("/{player_id}", response_model=PlayerRead)
def update_player(
    player_id: int, 
    player_update: PlayerUpdate, 
    supabase: Client = Depends(get_supabase)
):
    """
    Update a player by ID.
    """
    data = {k: v for k, v in player_update.dict().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    result = supabase.table("players").update(data).eq("id", player_id).single().execute()
    if result.error or result.data is None:
        raise HTTPException(status_code=404, detail="Player not found or update failed.")
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
    if result.error or (isinstance(result.data, list) and len(result.data) == 0):
        raise HTTPException(status_code=404, detail="Player not found or delete failed.")
    return
