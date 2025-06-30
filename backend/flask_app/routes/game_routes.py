from flask import Blueprint, jsonify

game_bp = Blueprint("game_bp", __name__)

@game_bp.route("/test", methods=["GET"])
def test_route():
    return jsonify({"message": "Game route working!"})
