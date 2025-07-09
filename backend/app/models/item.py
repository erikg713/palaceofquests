"""
Item model for marketplace and inventory
"""

from datetime import datetime
from app.extensions import db
import uuid

class Item(db.Model):
    """Item model for game items and marketplace"""
    
    __tablename__ = 'items'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Item properties
    item_type = db.Column(db.Enum('weapon', 'armor', 'consumable', 'material', 'cosmetic', name='item_type_enum'),
                         nullable=False)
    rarity = db.Column(db.Enum('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', name='rarity_enum'),
                      default='Common', nullable=False)
    
    # Stats and effects
    stats = db.Column(db.JSON, default=dict, nullable=False)
    effects = db.Column(db.JSON, default=list, nullable=False)
    
    # Pricing and availability
    pi_price = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    is_tradeable = db.Column(db.Boolean, default=True, nullable=False)
    is_stackable = db.Column(db.Boolean, default=False, nullable=False)
    max_stack_size = db.Column(db.Integer, default=1, nullable=False)
    
    # Requirements
    level_requirement = db.Column(db.Integer, default=1, nullable=False)
    class_requirement = db.Column(db.String(50), nullable=True)
    
    # Visual
    image_url = db.Column(db.String(255), nullable=True)
    icon_url = db.Column(db.String(255), nullable=True)
    
    # Availability
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    is_premium_only = db.Column(db.Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Item {self.name}>'
    
    def to_dict(self):
        """Convert item to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'item_type': self.item_type,
            'rarity': self.rarity,
            'stats': self.stats,
            'effects': self.effects,
            'pi_price': float(self.pi_price),
            'is_tradeable': self.is_tradeable,
            'is_stackable': self.is_stackable,
            'max_stack_size': self.max_stack_size,
            'level_requirement': self.level_requirement,
            'class_requirement': self.class_requirement,
            'image_url': self.image_url,
            'icon_url': self.icon_url,
            'is_available': self.is_available,
            'is_premium_only': self.is_premium_only,
            'created_at': self.created_at.isoformat()
        }
    
    def get_rarity_multiplier(self):
        """Get price multiplier based on rarity"""
        multipliers = {
            'Common': 1.0,
            'Uncommon': 1.5,
            'Rare': 2.5,
            'Epic': 4.0,
            'Legendary': 8.0
        }
        return multipliers.get(self.rarity, 1.0)
    
    def calculate_market_value(self):
        """Calculate item's market value"""
        base_value = float(self.pi_price)
        rarity_multiplier = self.get_rarity_multiplier()
        return base_value * rarity_multiplier
