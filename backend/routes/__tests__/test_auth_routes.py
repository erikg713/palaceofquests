import pytest
from flask import Flask
from backend.routes.auth_routes import auth_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(auth_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_register_success(client):
    resp = client.post("/register", json={'username': 'alice', 'password': 'secret'})
    assert resp.status_code == 201
    assert 'registered' in resp.get_json()['message']

def test_register_missing_fields(client):
    resp = client.post("/register", json={'username': 'bob'})
    assert resp.status_code == 400

def test_register_duplicate(client):
    client.post("/register", json={'username': 'eve', 'password': 'pw'})
    resp = client.post("/register", json={'username': 'eve', 'password': 'pw'})
    assert resp.status_code == 409

def test_login_success(client):
    client.post("/register", json={'username': 'charlie', 'password': 'pw2'})
    resp = client.post("/login", json={'username': 'charlie', 'password': 'pw2'})
    assert resp.status_code == 200
    assert 'Welcome' in resp.get_json()['message']

def test_login_invalid(client):
    resp = client.post("/login", json={'username': 'nouser', 'password': 'badpw'})
    assert resp.status_code == 401

def test_logout_success(client):
    client.post("/register", json={'username': 'dan', 'password': 'pw3'})
    resp = client.post("/logout", json={'username': 'dan'})
    assert resp.status_code == 200

def test_logout_missing_username(client):
    resp = client.post("/logout", json={})
    assert resp.status_code == 400
