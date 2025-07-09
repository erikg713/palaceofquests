"""
Quest model for game quests and challenges
"""

from datetime import datetime
from app.extensions import db
import uuid

class Quest(db.Model):
    """Quest model representing game challenges"""
    
    __tablename__ = 'quests'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Quest properties
    difficulty = db.Column(db.Enum('Easy', 'Medium', 'Hard', 'Epic', 'Legendary', name='difficulty_enum'), 
                          default='Easy', nullable=False)
    quest_type = db.Column(db.Enum('tutorial', 'combat', 'collection', 'exploration', 'social', name='quest_type_enum'),
                          default='tutorial', nullable=False)
    
    # Requirements and rewards
    level_requirement = db.Column(db.Integer, default=1, nullable=False)
    pi_reward = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    experience_reward = db.Column(db.Integer, default=100, nullable=False)
    
    # Quest objectives
    objectives = db.Column(db.JSON, default=list, nullable=False)
    max_progress = db.Column(db.Integer, default=1, nullable=False)
    
    # Quest availability
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_repeatable = db.Column(db.Boolean, default=False, nullable=False)
    cooldown_hours = db.Column(db.Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quest_progress = db.relationship('QuestProgress', backref='quest', lazy='dynamic', cascade='all, delete-orphan')
    user_quests = db.relationship('UserQuest', backref='quest', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Quest {self.title}>'
    
    def to_dict(self):
        """Convert quest to dictionary for API responses"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'quest_type': self.quest_type,
            'level_requirement': self.level_requirement,
            'pi_reward': float(self.pi_reward),
            'experience_reward': self.experience_reward,
            'objectives': self.objectives,
            'max_progress': self.max_progress,
            'is_active': self.is_active,
            'is_repeatable': self.is_repeatable,
            'cooldown_hours': self.cooldown_hours,
            'created_at': self.created_at.isoformat()
        }
    
    def get_difficulty_multiplier(self):
        """Get reward multiplier based on difficulty"""
        multipliers = {
            'Easy': 1.0,
            'Medium': 1.5,
            'Hard': 2.0,
            'Epic': 3.0,
            'Legendary': 5.0
        }
        return multipliers.get(self.difficulty, 1.0)
