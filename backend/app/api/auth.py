"""
Authentication endpoints for Pi Network integration
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import requests
from datetime import datetime

from app.extensions import db
from app.models.user import User
from app.utils.validation import validate_pi_auth
from app.utils.errors import ValidationError

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    """Authenticate user with Pi Network credentials"""
    try:
        data = request.get_json()
        
        if not data:
            raise ValidationError("Request body is required")
        
        # Validate Pi Network authentication data
        pi_auth_data = validate_pi_auth(data)
        
        # Verify with Pi Network API
        pi_user = verify_pi_user(pi_auth_data['access_token'])
        
        if not pi_user:
            raise ValidationError("Pi Network authentication failed")
        
        # Find or create user
        user = User.query.filter_by(pi_user_id=pi_user['uid']).first()
        
        if not user:
            # Create new user
            user = User(
                pi_user_id=pi_user['uid'],
                username=pi_user.get('username', f"Player_{pi_user['uid'][-6:]}"),
                email=pi_user.get('email'),
                pi_balance=10.0  # Welcome bonus
            )
            db.session.add(user)
            db.session.commit()
        else:
            # Update last active
            user.last_active = datetime.utcnow()
            db.session.commit()
        
        # Create JWT tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Authentication failed'}), 500

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        new_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'success': True,
            'access_token': new_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed'}), 500

@bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify current access token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token verification failed'}), 500

def verify_pi_user(access_token):
    """Verify user with Pi Network API"""
    try:
        from app.config import Config
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f"{Config.PI_API_URL}/v2/me",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
            
    except Exception as e:
        print(f"Pi Network verification error: {e}")
        return None

