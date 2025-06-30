# backend/routes/metaverse_routes.py

from flask import Blueprint, request, jsonify, abort, current_app
import uuid
import logging

metaverse_bp = Blueprint("metaverse", __name__)

# In-memory data store (replace with DB/service in production)
worlds = {}
world_members = {}

logger = logging.getLogger(__name__)

def get_world_or_404(world_id):
    world = worlds.get(world_id)
    if not world:
        abort(404, description="World not found")
    return world

@metaverse_bp.route('/worlds', methods=['GET'])
def list_worlds():
    """Return all worlds, optionally paginated."""
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))
    items = list(worlds.items())
    start = (page - 1) * per_page
    end = start + per_page
    result = [
        {**world, "id": wid}
        for wid, world in items[start:end]
    ]
    return jsonify(result), 200

@metaverse_bp.route('/worlds/<world_id>', methods=['GET'])
def get_world(world_id):
    """Get a single world by its ID."""
    world = get_world_or_404(world_id)
    return jsonify({**world, "id": world_id}), 200

@metaverse_bp.route('/worlds', methods=['POST'])
def create_world():
    """Create a new world."""
    data = request.get_json(force=True)
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "World name is required."}), 400
    world_id = str(uuid.uuid4())
    world_obj = {
        "name": name,
        "description": data.get("description", ""),
        # Extend with other fields as needed
    }
    worlds[world_id] = world_obj
    world_members[world_id] = set()
    logger.info("World created: %s", world_id)
    return jsonify({"id": world_id, "name": name}), 201

@metaverse_bp.route('/worlds/<world_id>/join', methods=['POST'])
def join_world(world_id):
    """Join a world by ID."""
    data = request.get_json(force=True)
    user = data.get("user", "").strip()
    if not user:
        return jsonify({"error": "User is required."}), 400
    get_world_or_404(world_id)
    if user in world_members[world_id]:
        return jsonify({"error": "User already joined."}), 400
    world_members[world_id].add(user)
    logger.info("User %s joined world %s", user, world_id)
    return jsonify({"message": f"User {user} joined world {world_id}."}), 200

# Note: Register this blueprint in your application entrypoint, not here.
