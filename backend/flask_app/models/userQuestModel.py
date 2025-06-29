class UserQuest(db.Model):
    __tablename__ = 'user_quests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    quest_id = db.Column(db.Integer, db.ForeignKey('quests.id'), nullable=False)
    progress = db.Column(db.Float, default=0.0)  # Percentage (0.0 to 100.0)
    status = db.Column(db.String(20), default='in_progress')  # in_progress, completed
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', backref='user_quests')

    def update_progress(self, progress_increase):
        """Update progress and complete quest if 100% reached."""
        self.progress = min(self.progress + progress_increase, 100.0)
        if self.progress >= 100.0:
            self.status = 'completed'
            self.completed_at = datetime.utcnow()

    def to_dict(self):
        """Serialize to JSON for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quest_id': self.quest_id,
            'progress': self.progress,
            'status': self.status,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
