class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    seller_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    buyer_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    status = db.Column(db.String(20), default='available')  # available, sold, pending
    item_type = db.Column(db.String(50), nullable=True)  # e.g., weapon, armor
    rarity = db.Column(db.String(20), nullable=True)  # e.g., common, rare
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    seller = db.relationship('User', foreign_keys=[seller_id], backref='items_for_sale')
    buyer = db.relationship('User', foreign_keys=[buyer_id], backref='purchased_items')

    def to_dict(self):
        """Serialize to JSON for API responses."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'seller_id': self.seller_id,
            'buyer_id': self.buyer_id,
            'status': self.status,
            'item_type': self.item_type,
            'rarity': self.rarity,
            'created_at': self.created_at.isoformat()
        }
