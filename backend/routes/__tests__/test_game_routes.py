import pytest
from flask import Flask
from backend.routes.game_routes import game_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(game_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_list_games_initially_empty(client):
    resp = client.get("/games")
    assert resp.status_code == 200
    assert resp.get_json() == []

def test_create_game_success(client):
    resp = client.post("/games", json={'name': 'Chess'})
    assert resp.status_code == 201
    data = resp.get_json()
    assert 'id' in data and data['name'] == 'Chess'

def test_create_game_missing_name(client):
    resp = client.post("/games", json={})
    assert resp.status_code == 400

def test_join_game_success(client):
    game_id = client.post("/games", json={'name': 'Poker'}).get_json()['id']
    resp = client.post(f"/games/{game_id}/join", json={'user': 'alice'})
    assert resp.status_code == 200
    assert 'joined game' in resp.get_json()['message']

def test_join_game_already_joined(client):
    game_id = client.post("/games", json={'name': 'Monopoly'}).get_json()['id']
    client.post(f"/games/{game_id}/join", json={'user': 'bob'})
    resp = client.post(f"/games/{game_id}/join", json={'user': 'bob'})
    assert resp.status_code == 400

def test_start_game_success(client):
    game_id = client.post("/games", json={'name': 'Soccer'}).get_json()['id']
    client.post(f"/games/{game_id}/join", json={'user': 'ann'})
    client.post(f"/games/{game_id}/join", json={'user': 'ken'})
    resp = client.post(f"/games/{game_id}/start")
    assert resp.status_code == 200
    assert 'started' in resp.get_json()['message']

def test_start_game_not_enough_players(client):
    game_id = client.post("/games", json={'name': 'Solo'}).get_json()['id']
    client.post(f"/games/{game_id}/join", json={'user': 'solo'})
    resp = client.post(f"/games/{game_id}/start")
    assert resp.status_code == 400
