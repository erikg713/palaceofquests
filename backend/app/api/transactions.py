"""
Transaction management endpoints
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

from app.extensions import db
from app.models.user import User
from app.models.transaction import Transaction
from app.utils.errors import ValidationError

bp = Blueprint('transactions', __name__)

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_transaction_history():
    """Get user's transaction history"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        transaction_type = request.args.get('type')
        status = request.args.get('status')
        days = request.args.get('days', type=int)
        
        # Build query
        query = Transaction.query.filter(Transaction.user_id == user.id)
        
        # Apply filters
        if transaction_type:
            query = query.filter(Transaction.transaction_type == transaction_type)
        if status:
            query = query.filter(Transaction.status == status)
        if days:
            since_date = datetime.utcnow() - timedelta(days=days)
            query = query.filter(Transaction.created_at >= since_date)
        
        # Order by most recent first
        query = query.order_by(Transaction.created_at.desc())
        
        # Paginate
        transactions = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        transactions_data = [transaction.to_dict() for transaction in transactions.items]
        
        return jsonify({
            'success': True,
            'transactions': transactions_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': transactions.total,
                'pages': transactions.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch transaction history'}), 500

@bp.route('/summary', methods=['GET'])
@jwt_required()
def get_transaction_summary():
    """Get user's transaction summary and statistics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate summary statistics
        total_earned = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.user_id == user.id,
            Transaction.transaction_type == 'quest_reward',
            Transaction.status == 'completed'
        ).scalar() or 0
        
        total_spent = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.user_id == user.id,
            Transaction.transaction_type.in_(['item_purchase', 'premium_subscription']),
            Transaction.status == 'completed'
        ).scalar() or 0
        
        quest_rewards_count = Transaction.query.filter(
            Transaction.user_id == user.id,
            Transaction.transaction_type == 'quest_reward',
            Transaction.status == 'completed'
        ).count()
        
        items_purchased_count = Transaction.query.filter(
            Transaction.user_id == user.id,
            Transaction.transaction_type == 'item_purchase',
            Transaction.status == 'completed'
        ).count()
        
        # Recent activity (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_transactions = Transaction.query.filter(
            Transaction.user_id == user.id,
            Transaction.created_at >= week_ago
        ).order_by(Transaction.created_at.desc()).limit(10).all()
        
        summary = {
            'current_balance': float(user.pi_balance),
            'total_earned': float(total_earned),
            'total_spent': float(total_spent),
            'net_balance': float(total_earned - total_spent),
            'quest_rewards_received': quest_rewards_count,
            'items_purchased': items_purchased_count,
            'recent_activity': [transaction.to_dict() for transaction in recent_transactions]
        }
        
        return jsonify({
            'success': True,
            'summary': summary
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch transaction summary'}), 500

@bp.route('/<transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction_details(transaction_id):
    """Get detailed information about a specific transaction"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        transaction = Transaction.query.filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user.id
        ).first()
        
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404
        
        transaction_data = transaction.to_dict()
        
        # Add related entity information
        if transaction.related_quest_id:
            from app.models.quest import Quest
            quest = Quest.query.get(transaction.related_quest_id)
            if quest:
                transaction_data['related_quest'] = {
                    'id': quest.id,
                    'title': quest.title,
                    'difficulty': quest.difficulty
                }
        
        if transaction.related_item_id:
            from app.models.item import Item
            item = Item.query.get(transaction.related_item_id)
            if item:
                transaction_data['related_item'] = {
                    'id': item.id,
                    'name': item.name,
                    'rarity': item.rarity,
                    'item_type': item.item_type
                }
        
        return jsonify({
            'success': True,
            'transaction': transaction_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch transaction details'}), 500

@bp.route('/pi-deposit', methods=['POST'])
@jwt_required()
def create_pi_deposit():
    """Create a Pi Network deposit transaction"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        amount = data.get('amount')
        pi_payment_id = data.get('pi_payment_id')
        
        if not amount or not pi_payment_id:
            raise ValidationError('Amount and Pi payment ID are required')
        
        if amount <= 0:
            raise ValidationError('Amount must be positive')
        
        # Check if payment ID already exists
        existing_transaction = Transaction.query.filter_by(pi_payment_id=pi_payment_id).first()
        if existing_transaction:
            return jsonify({'error': 'Payment ID already processed'}), 400
        
        # Create pending transaction
        transaction = Transaction(
            user_id=user.id,
            transaction_type='pi_deposit',
            amount=amount,
            pi_payment_id=pi_payment_id,
            status='pending',
            description=f'Pi Network deposit of {amount} PI'
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        # In a real implementation, you would verify the payment with Pi Network API here
        # For now, we'll simulate successful verification
        
        # Process the deposit
        user.add_pi(amount)
        transaction.mark_completed()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Successfully deposited {amount} PI',
            'transaction': transaction.to_dict(),
            'user_pi_balance': float(user.pi_balance)
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Deposit failed'}), 500
