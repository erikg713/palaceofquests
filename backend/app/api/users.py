"""
User management endpoints
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

from app.extensions import db
from app.models.user import User
from app.models.transaction import Transaction
from app.utils.errors import ValidationError

bp = Blueprint('users', __name__)

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
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
        return jsonify({'error': 'Failed to fetch profile'}), 500

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'username' in data:
            # Check if username is already taken
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user.id:
                raise ValidationError("Username already taken")
            user.username = data['username']
        
        if 'email' in data:
            user.email = data['email']
        
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        if 'avatar_upgrades' in data:
            user.avatar_upgrades = data['avatar_upgrades']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to update profile'}), 500

@bp.route('/premium/subscribe', methods=['POST'])
@jwt_required()
def subscribe_premium():
    """Subscribe to premium features"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        from app.config import Config
        subscription_cost = Config.PREMIUM_SUBSCRIPTION_PRICE
        
        if not user.can_afford(subscription_cost):
            return jsonify({'error': 'Insufficient Pi balance'}), 400
        
        # Process payment
        if user.deduct_pi(subscription_cost):
            # Set premium status
            user.is_premium = True
            user.premium_expires_at = datetime.utcnow() + timedelta(days=365)  # 1 year
            
            # Create transaction record
            transaction = Transaction(
                user_id=user.id,
                transaction_type='premium_subscription',
                amount=subscription_cost,
                status='completed',
                description='Premium subscription purchase',
                completed_at=datetime.utcnow()
            )
            
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Premium subscription activated',
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'error': 'Payment processing failed'}), 500
            
    except Exception as e:
        return jsonify({'error': 'Subscription failed'}), 500

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get detailed user statistics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate additional stats
        completed_quests = user.user_quests.filter_by(status='completed').count()
        total_pi_earned = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.user_id == user.id,
            Transaction.transaction_type == 'quest_reward',
            Transaction.status == 'completed'
        ).scalar() or 0
        
        stats = {
            'level': user.level,
            'experience': user.experience,
            'experience_to_next_level': user.experience_to_next_level(),
            'pi_balance': float(user.pi_balance),
            'completed_quests': completed_quests,
            'total_pi_earned': float(total_pi_earned),
            'is_premium': user.is_premium,
            'premium_expires_at': user.premium_expires_at.isoformat() if user.premium_expires_at else None,
            'account_age_days': (datetime.utcnow() - user.created_at).days,
            'last_active': user.last_active.isoformat()
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch stats'}), 500

@bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get user leaderboard"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 100)
        sort_by = request.args.get('sort_by', 'level')  # level, experience, pi_balance
        
        # Build query based on sort criteria
        if sort_by == 'level':
            query = User.query.order_by(User.level.desc(), User.experience.desc())
        elif sort_by == 'experience':
            query = User.query.order_by(User.experience.desc())
        elif sort_by == 'pi_balance':
            query = User.query.order_by(User.pi_balance.desc())
        else:
            query = User.query.order_by(User.level.desc())
        
        users = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        leaderboard = []
        for i, user in enumerate(users.items):
            rank = (page - 1) * per_page + i + 1
            leaderboard.append({
                'rank': rank,
                'username': user.username,
                'level': user.level,
                'experience': user.experience,
                'pi_balance': float(user.pi_balance),
                'is_premium': user.is_premium,
                'avatar_url': user.avatar_url
            })
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': users.total,
                'pages': users.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch leaderboard'}), 500
