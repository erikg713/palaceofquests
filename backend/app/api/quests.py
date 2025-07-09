"""
Quest system endpoints
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

from app.extensions import db
from app.models.user import User
from app.models.quest import Quest
from app.models.quest_progress import QuestProgress
from app.models.user_quest import UserQuest
from app.models.transaction import Transaction
from app.utils.errors import ValidationError

bp = Blueprint('quests', __name__)

@bp.route('/', methods=['GET'])
@jwt_required()
def get_available_quests():
    """Get available quests for current user"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get quests available for user's level
        available_quests = Quest.query.filter(
            Quest.is_active == True,
            Quest.level_requirement <= user.level
        ).all()
        
        # Get user's quest progress
        user_quest_ids = [uq.quest_id for uq in user.user_quests.filter(
            UserQuest.status.in_(['accepted', 'in_progress', 'completed'])
        ).all()]
        
        quests_data = []
        for quest in available_quests:
            quest_data = quest.to_dict()
            
            # Add user-specific information
            user_quest = user.user_quests.filter_by(quest_id=quest.id).first()
            if user_quest:
                quest_data['user_status'] = user_quest.status
                quest_data['accepted_at'] = user_quest.accepted_at.isoformat()
                quest_data['can_accept'] = False
            else:
                quest_data['user_status'] = 'available'
                quest_data['can_accept'] = True
            
            # Check if quest is on cooldown
            if quest.is_repeatable and user_quest and user_quest.completed_at:
                cooldown_end = user_quest.completed_at + timedelta(hours=quest.cooldown_hours)
                if datetime.utcnow() < cooldown_end:
                    quest_data['can_accept'] = False
                    quest_data['cooldown_ends_at'] = cooldown_end.isoformat()
            
            quests_data.append(quest_data)
        
        return jsonify({
            'success': True,
            'quests': quests_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch quests'}), 500

@bp.route('/<quest_id>/accept', methods=['POST'])
@jwt_required()
def accept_quest(quest_id):
    """Accept a quest"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        quest = Quest.query.get(quest_id)
        if not quest:
            return jsonify({'error': 'Quest not found'}), 404
        
        # Check if user meets requirements
        if user.level < quest.level_requirement:
            return jsonify({'error': 'Level requirement not met'}), 400
        
        # Check if quest is already accepted
        existing_user_quest = user.user_quests.filter_by(quest_id=quest_id).first()
        if existing_user_quest and existing_user_quest.status in ['accepted', 'in_progress']:
            return jsonify({'error': 'Quest already accepted'}), 400
        
        # Check cooldown for repeatable quests
        if quest.is_repeatable and existing_user_quest and existing_user_quest.completed_at:
            cooldown_end = existing_user_quest.completed_at + timedelta(hours=quest.cooldown_hours)
            if datetime.utcnow() < cooldown_end:
                return jsonify({'error': 'Quest is on cooldown'}), 400
        
        # Create user quest
        user_quest = UserQuest(
            user_id=user.id,
            quest_id=quest.id,
            status='accepted',
            pi_reward_amount=quest.pi_reward,
            experience_reward_amount=quest.experience_reward
        )
        
        # Set expiration if needed (24 hours default)
        user_quest.set_expiration(24)
        
        # Create quest progress tracker
        quest_progress = QuestProgress(
            user_id=user.id,
            quest_id=quest.id
        )
        
        db.session.add(user_quest)
        db.session.add(quest_progress)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quest accepted successfully',
            'user_quest': user_quest.to_dict(),
            'quest_progress': quest_progress.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to accept quest'}), 500

@bp.route('/<quest_id>/progress', methods=['POST'])
@jwt_required()
def update_quest_progress(quest_id):
    """Update quest progress"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        progress_increment = data.get('progress', 1)
        completion_data = data.get('completion_data', {})
        
        # Get quest progress
        quest_progress = QuestProgress.query.filter_by(
            user_id=user.id,
            quest_id=quest_id
        ).first()
        
        if not quest_progress:
            return jsonify({'error': 'Quest not found or not accepted'}), 404
        
        # Update progress
        quest_completed = quest_progress.update_progress(progress_increment, completion_data)
        
        # Update user quest status
        user_quest = UserQuest.query.filter_by(
            user_id=user.id,
            quest_id=quest_id
        ).first()
        
        if quest_completed and user_quest:
            user_quest.status = 'completed'
            user_quest.completed_at = datetime.utcnow()
        elif user_quest and user_quest.status == 'accepted':
            user_quest.status = 'in_progress'
        
        db.session.commit()
        
        response_data = {
            'success': True,
            'quest_progress': quest_progress.to_dict(),
            'quest_completed': quest_completed
        }
        
        if quest_completed:
            response_data['message'] = 'Quest completed! Claim your rewards.'
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update quest progress'}), 500

@bp.route('/<quest_id>/claim', methods=['POST'])
@jwt_required()
def claim_quest_rewards(quest_id):
    """Claim quest completion rewards"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_quest = UserQuest.query.filter_by(
            user_id=user.id,
            quest_id=quest_id
        ).first()
        
        if not user_quest:
            return jsonify({'error': 'Quest not found'}), 404
        
        if not user_quest.can_claim_rewards():
            return jsonify({'error': 'Cannot claim rewards for this quest'}), 400
        
        # Award rewards
        pi_reward = float(user_quest.pi_reward_amount)
        exp_reward = user_quest.experience_reward_amount
        
        user.add_pi(pi_reward)
        leveled_up = user.add_experience(exp_reward)
        
        # Mark rewards as claimed
        user_quest.rewards_claimed = True
        
        # Create transaction record
        transaction = Transaction(
            user_id=user.id,
            transaction_type='quest_reward',
            amount=pi_reward,
            status='completed',
            related_quest_id=quest_id,
            description=f'Quest reward: {user_quest.quest.title}',
            completed_at=datetime.utcnow()
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        response_data = {
            'success': True,
            'message': 'Rewards claimed successfully!',
            'rewards': {
                'pi_coins': pi_reward,
                'experience': exp_reward,
                'leveled_up': leveled_up
            },
            'user': user.to_dict()
        }
        
        if leveled_up:
            response_data['message'] += f' Congratulations, you reached level {user.level}!'
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to claim rewards'}), 500

@bp.route('/my-quests', methods=['GET'])
@jwt_required()
def get_my_quests():
    """Get current user's accepted quests"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        status_filter = request.args.get('status', 'all')
        
        query = user.user_quests
        if status_filter != 'all':
            query = query.filter_by(status=status_filter)
        
        user_quests = query.all()
        
        quests_data = []
        for user_quest in user_quests:
            quest_data = user_quest.quest.to_dict()
            quest_data.update({
                'user_quest_id': user_quest.id,
                'status': user_quest.status,
                'accepted_at': user_quest.accepted_at.isoformat(),
                'completed_at': user_quest.completed_at.isoformat() if user_quest.completed_at else None,
                'expires_at': user_quest.expires_at.isoformat() if user_quest.expires_at else None,
                'rewards_claimed': user_quest.rewards_claimed,
                'can_claim_rewards': user_quest.can_claim_rewards()
            })
            
            # Add progress information
            quest_progress = QuestProgress.query.filter_by(
                user_id=user.id,
                quest_id=user_quest.quest_id
            ).first()
            
            if quest_progress:
                quest_data['progress'] = quest_progress.to_dict()
            
            quests_data.append(quest_data)
        
        return jsonify({
            'success': True,
            'quests': quests_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user quests'}), 500
