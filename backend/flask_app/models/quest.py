from supabase import create_client, Client
from typing import Optional, List, Dict
from datetime import datetime
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Quest:
    def __init__(self, id: int, title: str, description: str, difficulty: str,
                 reward: int, is_active: bool, created_at: str, updated_at: str, creator_id: int):
        self.id = id
        self.title = title
        self.description = description
        self.difficulty = difficulty
        self.reward = reward
        self.is_active = is_active
        self.created_at = created_at
        self.updated_at = updated_at
        self.creator_id = creator_id

    @classmethod
    def from_dict(cls, data: Dict):
        return cls(
            id=data["id"],
            title=data["title"],
            description=data["description"],
            difficulty=data["difficulty"],
            reward=data["reward"],
            is_active=data["is_active"],
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            creator_id=data["creator_id"]
        )

    @staticmethod
    def get_all(active_only: bool = True) -> List['Quest']:
        query = supabase.table("quests").select("*")
        if active_only:
            query = query.eq("is_active", True)
        result = query.execute()
        return [Quest.from_dict(record) for record in result.data]

    @staticmethod
    def get_by_id(quest_id: int) -> Optional['Quest']:
        result = supabase.table("quests").select("*").eq("id", quest_id).single().execute()
        if result.data:
            return Quest.from_dict(result.data)
        return None

    @staticmethod
    def create(data: Dict) -> 'Quest':
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        result = supabase.table("quests").insert(data).execute()
        return Quest.from_dict(result.data[0])

    def update(self, data: Dict) -> 'Quest':
        data["updated_at"] = datetime.utcnow().isoformat()
        result = supabase.table("quests").update(data).eq("id", self.id).execute()
        return Quest.from_dict(result.data[0])

    def delete(self) -> None:
        supabase.table("quests").delete().eq("id", self.id).execute()

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "difficulty": self.difficulty,
            "reward": self.reward,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "creator_id": self.creator_id,
        }

    def __repr__(self):
        return f"<Quest {self.id} '{self.title}' ({self.difficulty})>"

