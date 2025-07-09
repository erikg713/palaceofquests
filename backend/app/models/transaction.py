"""
Transaction model for Pi Network payments and game economy
"""

from datetime import datetime
from app.extensions import db
import uuid

class Transaction(db.Model):
    """Transaction model for tracking Pi payments and game economy"""
    
    __tablename__ = 'transactions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    
    # Transaction details
    transaction_type = db.Column(db.Enum('quest_reward', 'item_purchase', 'premium_subscription', 
                                        'marketplace_sale', 'marketplace_purchase', 'pi_deposit',
                                        name='transaction_type_enum'), nullable=False)
    
    # Pi Network integration
    pi_payment_id = db.Column(db.String(100), unique=True, nullable=True)
    pi_transaction_hash = db.Column(db.String(255), nullable=True)
    
    # Amount and currency
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), default='PI', nullable=False)
    
    # Transaction status
    status = db.Column(db.Enum('pending', 'completed', 'failed', 'cancelled', name='transaction_status_enum'),
                      default='pending', nullable=False)
    
    # Related entities
    related_quest_id = db.Column(db.String(36), nullable=True)
    related_item_id = db.Column(db.String(36), nullable=True)
    
    # Metadata
    metadata = db.Column(db.JSON, default=dict, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Transaction {self.id}:{self.transaction_type}:{self.amount}>'
    
    def to_dict(self):
        """Convert transaction to dictionary for API responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'transaction_type': self.transaction_type,
            'pi_payment_id': self.pi_payment_id,
            'pi_transaction_hash': self.pi_transaction_hash,
            'amount': float(self.amount),
            'currency': self.currency,
            'status': self.status,
            'related_quest_id': self.related_quest_id,
            'related_item_id': self.related_item_id,
            'metadata': self.metadata,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'updated_at': self.updated_at.isoformat()
        }
    
    def mark_completed(self):
        """Mark transaction as completed"""
        self.status = 'completed'
        self.completed_at = datetime.utcnow()
    
    def mark_failed(self, reason=None):
        """Mark transaction as failed"""
        self.status = 'failed'
        if reason:
            self.metadata['failure_reason'] = reason
