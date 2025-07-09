"""
User quest relationship model for tracking accepted quests
"""

from datetime import datetime, timedelta
from app.extensions import db
import uuid

class UserQuest(db.Model):
    """Track quests accepted by users"""
    
    __tablename__ = 'user_quests'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    quest_id = db.Column(db.String(36), db.ForeignKey('quests.id'), nullable=False)
    
    # Quest status
    status = db.Column(db.Enum('accepted', 'in_progress', 'completed', 'failed', 'abandoned', name='quest_status_enum'),
                      default='accepted', nullable=False)
    
    # Timing
    accepted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    expires_at = db.Column(db.DateTime, nullable=True)
    
    # Rewards tracking
    rewards_claimed = db.Column(db.Boolean, default=False, nullable=False)
    pi_reward_amount = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    experience_reward_amount = db.Column(db.Integer, default=0, nullable=False)
    
    # Unique constraint for active quests
    __table_args__ = (
        db.UniqueConstraint('user_id', 'quest_id', name='unique_active_user_quest'),
    )
    
    def __repr__(self):
        return f'<UserQuest {self.user_id}:{self.quest_id}:{self.status}>'
    
    def to_dict(self):
        """Convert user quest to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quest_id': self.quest_id,
            'status': self.status,
            'accepted_at': self.accepted_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'rewards_claimed': self.rewards_claimed,
            'pi_reward_amount': float(self.pi_reward_amount),
            'experience_reward_amount': self.experience_reward_amount
        }
    
    def is_expired(self):
        """Check if quest has expired"""
        return self.expires_at and datetime.utcnow() > self.expires_at
    
    def can_claim_rewards(self):
        """Check if rewards can be claimed"""
        return (self.status == 'completed' and 
                not self.rewards_claimed and 
                not self.is_expired())
    
    def set_expiration(self, hours=24):
        """Set quest expiration time"""
        self.expires_at = datetime.utcnow() + timedelta(hours=hours)
