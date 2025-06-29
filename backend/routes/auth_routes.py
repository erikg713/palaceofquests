# backend/routes/auth_routes.py

from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

# In-memory user store for demonstration
users = {}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required.'}), 400
    if username in users:
        return jsonify({'error': 'Username already exists.'}), 409
    users[username] = password  # NOTE: Never store plaintext passwords in production
    return jsonify({'message': f'User {username} registered.'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required.'}), 400
    if users.get(username) != password:
        return jsonify({'error': 'Invalid credentials.'}), 401
    return jsonify({'message': f'Welcome, {username}!'}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'Username required.'}), 400
    if username not in users:
        return jsonify({'error': 'User not found.'}), 404
    return jsonify({'message': f'User {username} logged out.'}), 200
