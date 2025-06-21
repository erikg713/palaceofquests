from .. import db
from uuid import uuid4

class User(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    pi_username = db.Column(db.String, unique=True, nullable=False)
