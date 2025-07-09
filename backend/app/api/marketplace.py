"""
Marketplace endpoints for item trading
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from app.extensions import db
from app.models.user import User
from app.models.item import Item
from app.models.transaction import Transaction
from app.utils.errors import ValidationError, InsufficientFundsError

bp = Blueprint('marketplace', __name__)

@bp.route('/items', methods=['GET'])
@jwt_required()
def get_marketplace_items():
    """Get available items in marketplace"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        item_type = request.args.get('type')
        rarity = request.args.get('rarity')
        min_level = request.args.get('min_level', type=int)
        max_level = request.args.get('max_level', type=int)
        sort_by = request.args.get('sort_by', 'created_at')  # name, pi_price, level_requirement, created_at
        
        # Build query
        query = Item.query.filter(Item.is_available == True)
        
        # Apply filters
        if item_type:
            query = query.filter(Item.item_type == item_type)
        if rarity:
            query = query.filter(Item.rarity == rarity)
        if min_level:
            query = query.filter(Item.level_requirement >= min_level)
        if max_level:
            query = query.filter(Item.level_requirement <= max_level)
        
        # Filter premium items for non-premium users
        if not user.is_premium:
            query = query.filter(Item.is_premium_only == False)
        
        # Apply sorting
        if sort_by == 'name':
            query = query.order_by(Item.name)
        elif sort_by == 'pi_price':
            query = query.order_by(Item.pi_price)
        elif sort_by == 'level_requirement':
            query = query.order_by(Item.level_requirement)
        else:
            query = query.order_by(Item.created_at.desc())
        
        # Paginate
        items = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        items_data = []
        for item in items.items:
            item_data = item.to_dict()
            # Add user-specific information
            item_data['can_afford'] = user.can_afford(item.pi_price)
            item_data['meets_level_requirement'] = user.level >= item.level_requirement
            item_data['can_purchase'] = (
                item_data['can_afford'] and 
                item_data['meets_level_requirement'] and
                (not item.is_premium_only or user.is_premium)
            )
            items_data.append(item_data)
        
        return jsonify({
            'success': True,
            'items': items_data,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': items.total,
                'pages': items.pages
            },
            'user_pi_balance': float(user.pi_balance)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch marketplace items'}), 500

@bp.route('/items/<item_id>/purchase', methods=['POST'])
@jwt_required()
def purchase_item(item_id):
    """Purchase an item from the marketplace"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        item = Item.query.get(item_id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        if not item.is_available:
            return jsonify({'error': 'Item is not available for purchase'}), 400
        
        # Check requirements
        if user.level < item.level_requirement:
            return jsonify({'error': f'Level {item.level_requirement} required'}), 400
        
        if item.is_premium_only and not user.is_premium:
            return jsonify({'error': 'Premium subscription required'}), 400
        
        if not user.can_afford(item.pi_price):
            raise InsufficientFundsError('Insufficient Pi balance')
        
        # Process purchase
        if user.deduct_pi(item.pi_price):
            # Create transaction record
            transaction = Transaction(
                user_id=user.id,
                transaction_type='item_purchase',
                amount=item.pi_price,
                status='completed',
                related_item_id=item.id,
                description=f'Purchased {item.name}',
                completed_at=datetime.utcnow()
            )
            
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': f'Successfully purchased {item.name}!',
                'item': item.to_dict(),
                'transaction': transaction.to_dict(),
                'user_pi_balance': float(user.pi_balance)
            }), 200
        else:
            return jsonify({'error': 'Purchase failed'}), 500
            
    except InsufficientFundsError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Purchase failed'}), 500

@bp.route('/categories', methods=['GET'])
def get_item_categories():
    """Get available item categories and rarities"""
    try:
        # Get distinct item types and rarities
        item_types = db.session.query(Item.item_type).distinct().all()
        rarities = db.session.query(Item.rarity).distinct().all()
        
        categories = {
            'item_types': [item_type[0] for item_type in item_types],
            'rarities': [rarity[0] for rarity in rarities],
            'level_ranges': [
                {'label': '1-10', 'min': 1, 'max': 10},
                {'label': '11-25', 'min': 11, 'max': 25},
                {'label': '26-50', 'min': 26, 'max': 50},
                {'label': '51-100', 'min': 51, 'max': 100},
                {'label': '101+', 'min': 101, 'max': 250}
            ]
        }
        
        return jsonify({
            'success': True,
            'categories': categories
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch categories'}), 500

@bp.route('/featured', methods=['GET'])
def get_featured_items():
    """Get featured marketplace items"""
    try:
        # Get featured items (high rarity, popular, new releases)
        featured_items = Item.query.filter(
            Item.is_available == True,
            Item.rarity.in_(['Epic', 'Legendary'])
        ).order_by(Item.created_at.desc()).limit(6).all()
        
        new_items = Item.query.filter(
            Item.is_available == True
        ).order_by(Item.created_at.desc()).limit(4).all()
        
        popular_items = Item.query.filter(
            Item.is_available == True,
            Item.rarity.in_(['Rare', 'Epic'])
        ).order_by(Item.pi_price.desc()).limit(4).all()
        
        return jsonify({
            'success': True,
            'featured': {
                'legendary_items': [item.to_dict() for item in featured_items],
                'new_releases': [item.to_dict() for item in new_items],
                'popular_items': [item.to_dict() for item in popular_items]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch featured items'}), 500
