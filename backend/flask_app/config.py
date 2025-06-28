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
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    # General Config
    SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24  # 1 day in seconds

    # Database
     SUPABASE#

    # Pi Network Integration
    PI_API_KEY = os.environ.get('PI_API_KEY', '')
    PI_API_URL = os.environ.get('PI_API_URL', 'https://api.minepi.com/v2/')

    # Other Configurations
    DEBUG = True
    TESTING = True

class ProductionConfig(Config):
    ENV = 'production'
    DEBUG = False

class DevelopmentConfig(Config):
    ENV = 'development'
    DEBUG = True
    SESSION_COOKIE_SECURE = False  # For local testing

class TestingConfig(Config):
    ENV = 'testing'
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SESSION_COOKIE_SECURE = False

# Dictionary mapping for easy access
config_by_name = dict(
    development=DevelopmentConfig,
    production=ProductionConfig,
    testing=TestingConfig
)
