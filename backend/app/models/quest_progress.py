"""
Quest progress tracking model
"""

from datetime import datetime
from app.extensions import db
import uuid

class QuestProgress(db.Model):
    """Track individual quest progress for users"""
    
    __tablename__ = 'quest_progress'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    quest_id = db.Column(db.String(36), db.ForeignKey('quests.id'), nullable=False)
    
    # Progress tracking
    current_progress = db.Column(db.Integer, default=0, nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    completion_data = db.Column(db.JSON, default=dict, nullable=False)
    
    # Timestamps
    started_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint to prevent duplicate progress entries
    __table_args__ = (db.UniqueConstraint('user_id', 'quest_id', name='unique_user_quest_progress'),)
    
    def __repr__(self):
        return f'<QuestProgress {self.user_id}:{self.quest_id}>'
    
    def to_dict(self):
        """Convert quest progress to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quest_id': self.quest_id,
            'current_progress': self.current_progress,
            'is_completed': self.is_completed,
            'completion_data': self.completion_data,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'updated_at': self.updated_at.isoformat()
        }
    
    def update_progress(self, progress_increment=1, completion_data=None):
        """Update quest progress"""
        self.current_progress += progress_increment
        
        if completion_data:
            self.completion_data.update(completion_data)
        
        # Check if quest is completed
        if self.current_progress >= self.quest.max_progress and not self.is_completed:
            self.is_completed = True
            self.completed_at = datetime.utcnow()
            return True  # Quest completed
        
        return False  # Quest not yet completed
