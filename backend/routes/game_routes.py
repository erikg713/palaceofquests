# backend/routes/game_routes.py

from flask import Blueprint, request, jsonify, abort
import uuid

game_bp = Blueprint('game', __name__)

# In-memory mock database
games = {}

def get_game_or_404(game_id):
    game = games.get(game_id)
    if not game:
        abort(404, description="Game not found")
    return game

@game_bp.route('/games', methods=['GET'])
def list_games():
    return jsonify([
        {**game, 'id': game_id}
        for game_id, game in games.items()
    ]), 200

@game_bp.route('/games', methods=['POST'])
def create_game():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Game name is required.'}), 400
    game_id = str(uuid.uuid4())
    games[game_id] = {
        'name': name,
        'players': [],
        'status': 'waiting',
    }
    return jsonify({'id': game_id, 'name': name}), 201

@game_bp.route('/games/<game_id>/join', methods=['POST'])
def join_game(game_id):
    data = request.get_json()
    user = data.get('user')
    if not user:
        return jsonify({'error': 'User is required.'}), 400
    game = get_game_or_404(game_id)
    if user in game['players']:
        return jsonify({'error': 'User already joined.'}), 400
    game['players'].append(user)
    return jsonify({'message': f'User {user} joined game {game_id}.'}), 200

@game_bp.route('/games/<game_id>/start', methods=['POST'])
def start_game(game_id):
    game = get_game_or_404(game_id)
    if game['status'] != 'waiting':
        return jsonify({'error': 'Game already started or finished.'}), 400
    if len(game['players']) < 2:
        return jsonify({'error': 'At least two players required.'}), 400
    game['status'] = 'in_progress'
    return jsonify({'message': f'Game {game_id} started.'}), 200
