"""
User model for Palace of Quests players
"""

from datetime import datetime
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

class User(db.Model):
    """User model representing game players"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pi_user_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    
    # Game progression
    level = db.Column(db.Integer, default=1, nullable=False)
    experience = db.Column(db.Integer, default=0, nullable=False)
    pi_balance = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    
    # Player stats
    health = db.Column(db.Integer, default=100, nullable=False)
    max_health = db.Column(db.Integer, default=100, nullable=False)
    mana = db.Column(db.Integer, default=50, nullable=False)
    max_mana = db.Column(db.Integer, default=50, nullable=False)
    attack = db.Column(db.Integer, default=10, nullable=False)
    defense = db.Column(db.Integer, default=5, nullable=False)
    
    # Subscription and premium features
    is_premium = db.Column(db.Boolean, default=False, nullable=False)
    premium_expires_at = db.Column(db.DateTime, nullable=True)
    
    # Avatar and customization
    avatar_url = db.Column(db.String(255), nullable=True)
    avatar_upgrades = db.Column(db.JSON, default=dict, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    quest_progress = db.relationship('QuestProgress', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    user_quests = db.relationship('UserQuest', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        """Convert user to dictionary for API responses"""
        return {
            'id': self.id,
            'username': self.username,
            'level': self.level,
            'experience': self.experience,
            'pi_balance': float(self.pi_balance),
            'health': self.health,
            'max_health': self.max_health,
            'mana': self.mana,
            'max_mana': self.max_mana,
            'attack': self.attack,
            'defense': self.defense,
            'is_premium': self.is_premium,
            'premium_expires_at': self.premium_expires_at.isoformat() if self.premium_expires_at else None,
            'avatar_url': self.avatar_url,
            'avatar_upgrades': self.avatar_upgrades,
            'created_at': self.created_at.isoformat(),
            'last_active': self.last_active.isoformat()
        }
    
    def calculate_level_from_experience(self):
        """Calculate level based on experience points"""
        from app.config import Config
        base_exp = Config.LEVEL_UP_EXPERIENCE_BASE
        return min(int((self.experience / base_exp) ** 0.5) + 1, Config.MAX_LEVEL)
    
    def experience_to_next_level(self):
        """Calculate experience needed for next level"""
        from app.config import Config
        base_exp = Config.LEVEL_UP_EXPERIENCE_BASE
        next_level = min(self.level + 1, Config.MAX_LEVEL)
        return (next_level - 1) ** 2 * base_exp - self.experience
    
    def add_experience(self, exp_amount):
        """Add experience and handle level ups"""
        old_level = self.level
        self.experience += exp_amount
        new_level = self.calculate_level_from_experience()
        
        if new_level > old_level:
            self.level = new_level
            # Level up bonuses
            health_bonus = (new_level - old_level) * 10
            mana_bonus = (new_level - old_level) * 5
            self.max_health += health_bonus
            self.max_mana += mana_bonus
            self.health = self.max_health  # Full heal on level up
            self.mana = self.max_mana
            return True  # Leveled up
        
        return False  # No level up
    
    def can_afford(self, amount):
        """Check if user can afford a purchase"""
        return float(self.pi_balance) >= float(amount)
    
    def deduct_pi(self, amount):
        """Deduct Pi coins from user balance"""
        if self.can_afford(amount):
            self.pi_balance -= amount
            return True
        return False
    
    def add_pi(self, amount):
        """Add Pi coins to user balance"""
        self.pi_balance += amount
