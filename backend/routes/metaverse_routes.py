# backend/routes/metaverse_routes.py

from flask import Blueprint, request, jsonify, abort
import uuid

metaverse_bp = Blueprint('metaverse', __name__)

# --- In-memory "database" for demonstration purposes ---
worlds = {}
world_members = {}

def get_world_or_404(world_id):
    world = worlds.get(world_id)
    if not world:
        abort(404, description="World not found")
    return world

# --- Routes ---

@metaverse_bp.route('/worlds', methods=['GET'])
def list_worlds():
    """
    List all available worlds.
    """
    return jsonify([
        {**world, 'id': world_id}
        for world_id, world in worlds.items()
    ]), 200

@metaverse_bp.route('/worlds', methods=['POST'])
def create_world():
    """
    Create a new world.
    """
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'World name is required.'}), 400

    world_id = str(uuid.uuid4())
    worlds[world_id] = {
        'name': name,
        'description': data.get('description', ''),
        # Add additional fields here as needed
    }
    world_members[world_id] = set()
    return jsonify({'id': world_id, 'name': name}), 201

@metaverse_bp.route('/worlds/<world_id>/join', methods=['POST'])
def join_world(world_id):
    """
    Join a world by ID.
    """
    user = request.json.get('user')
    if not user:
        return jsonify({'error': 'User is required.'}), 400

    get_world_or_404(world_id)
    world_members[world_id].add(user)
    return jsonify({'message': f'User {user} joined world {world_id}.'}), 200

# --- Optionally, add more endpoints here for advanced functionality ---

# To use this blueprint, register it in your Flask app:
# from backend.routes.metaverse_routes import metaverse_bp
# app.register_blueprint(metaverse_bp)
