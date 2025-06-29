from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    PI_API_KEY: str
    PI_WALLET_PRIVATE_SEED: str

    class Config:
        env_file = ".env"

settings = Settings()

"""
Configurations for Flask application.
BaseConfig: Default settings.
DevelopmentConfig: Overrides for development.
TestingConfig: Overrides for testing.
ProductionConfig: Overrides for production.
"""

import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from a .env file if present
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)


class Config:
    """Base configuration."""

    # General Flask Config
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(24)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24  # 1 day in seconds

    # Supabase / Database
    SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
    SUPABASE_API_KEY = os.environ.get('SUPABASE_API_KEY', '')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
    SUPABASE_DB_URL = os.environ.get('SUPABASE_DB_URL', '')  # Optional direct PG URI

    # Pi Network Integration
    PI_API_KEY = os.environ.get('PI_API_KEY', '')
    PI_WALLET_PRIVATE_SEED = os.environ.get('PI_WALLET_PRIVATE_SEED', '')
    PI_API_URL = os.environ.get('PI_API_URL', 'https://api.minepi.com/v2/')
    PI_NETWORK = os.environ.get('PI_NETWORK', 'Pi Testnet')

    # Debugging Defaults (can be overridden)
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    ENV = 'development'
    DEBUG = True
    SESSION_COOKIE_SECURE = False  # Allow HTTP for local testing


class TestingConfig(Config):
    ENV = 'testing'
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SESSION_COOKIE_SECURE = False
    

# Dictionary mapping for app factory
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
}
