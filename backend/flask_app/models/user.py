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
