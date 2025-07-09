"""
Input validation utilities
"""

from marshmallow import Schema, fields, ValidationError as MarshmallowValidationError
from app.utils.errors import ValidationError

class PiAuthSchema(Schema):
    """Schema for Pi Network authentication data"""
    access_token = fields.Str(required=True)
    user = fields.Dict(required=True)

class QuestProgressSchema(Schema):
    """Schema for quest progress updates"""
    progress = fields.Int(missing=1, validate=lambda x: x > 0)
    completion_data = fields.Dict(missing=dict)

class UserProfileSchema(Schema):
    """Schema for user profile updates"""
    username = fields.Str(validate=lambda x: len(x) >= 3 and len(x) <= 50)
    email = fields.Email()
    avatar_url = fields.Url()
    avatar_upgrades = fields.Dict()

def validate_pi_auth(data):
    """Validate Pi Network authentication data"""
    schema = PiAuthSchema()
    try:
        return schema.load(data)
    except MarshmallowValidationError as e:
        raise ValidationError(f"Invalid authentication data: {e.messages}")

def validate_quest_progress(data):
    """Validate quest progress data"""
    schema = QuestProgressSchema()
    try:
        return schema.load(data)
    except MarshmallowValidationError as e:
        raise ValidationError(f"Invalid progress data: {e.messages}")

def validate_user_profile(data):
    """Validate user profile data"""
    schema = UserProfileSchema()
    try:
        return schema.load(data)
    except MarshmallowValidationError as e:
        raise ValidationError(f"Invalid profile data: {e.messages}")
