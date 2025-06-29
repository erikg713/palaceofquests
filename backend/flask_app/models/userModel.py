from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Hash in production
    level = db.Column(db.Integer, default=1)
    xp = db.Column(db.Float, default=0.0)
    rewards = db.Column(db.Float, default=0.0)  # In-game currency
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def add_xp(self, xp_gained):
        """Add XP and handle level-ups (100 XP per level)."""
        self.xp += xp_gained
        while self.xp >= 100:
            self.level += 1
            self.xp -= 100

    def add_rewards(self, reward_amount):
        """Add rewards to user's total."""
        self.rewards += reward_amount

    def can_start_quest(self, quest):
        """Check if user meets the quest's level requirement."""
        return self.level >= quest.level_required

    def to_dict(self):
        """Serialize to JSON for API responses."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'level': self.level,
            'xp': self.xp,
            'rewards': self.rewards,
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f"<User {self.username}>"

from .. import db
from uuid import uuid4

class User(db.Model):
    """
    User Model:
    Represents a user in the application with authentication and profile details.
    """
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    pi_username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        """
        Serialize the user object to a dictionary.
        """
        return {
            "id": self.id,
            "pi_username": self.pi_username,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "is_active": self.is_active
        }

    def __repr__(self):
        return f"<User {self.pi_username}>"
