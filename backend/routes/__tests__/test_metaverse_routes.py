from backend.routes.metaverse_routes import metaverse_bp
app.register_blueprint(metaverse_bp)
import pytest
from flask import Flask
from backend.routes.metaverse_routes import metaverse_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(metaverse_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_list_worlds_initially_empty(client):
    response = client.get("/worlds")
    assert response.status_code == 200
    assert response.get_json() == []

def test_create_world_success(client):
    payload = {"name": "Cyber Realm", "description": "A digital universe"}
    response = client.post("/worlds", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert "id" in data
    assert data["name"] == "Cyber Realm"

def test_create_world_missing_name(client):
    payload = {"description": "Nameless world"}
    response = client.post("/worlds", json=payload)
    assert response.status_code == 400
    assert "error" in response.get_json()

def test_list_worlds_after_creation(client):
    # Create a world first
    client.post("/worlds", json={"name": "NeoWorld"})
    response = client.get("/worlds")
    assert response.status_code == 200
    worlds = response.get_json()
    assert isinstance(worlds, list)
    assert any(w["name"] == "NeoWorld" for w in worlds)

def test_join_world_success(client):
    # Create a world
    create_response = client.post("/worlds", json={"name": "JoinableWorld"})
    world_id = create_response.get_json()["id"]

    # Join the world
    join_payload = {"user": "alice"}
    join_response = client.post(f"/worlds/{world_id}/join", json=join_payload)
    assert join_response.status_code == 200
    assert "joined world" in join_response.get_json()["message"]

def test_join_world_missing_user(client):
    # Create a world
    create_response = client.post("/worlds", json={"name": "UserlessWorld"})
    world_id = create_response.get_json()["id"]

    # Attempt join without user
    join_response = client.post(f"/worlds/{world_id}/join", json={})
    assert join_response.status_code == 400
    assert "error" in join_response.get_json()

def test_join_nonexistent_world(client):
    join_payload = {"user": "bob"}
    response = client.post("/worlds/invalid-id/join", json=join_payload)
    assert response.status_code == 404
    assert "World not found" in response.get_data(as_text=True)
