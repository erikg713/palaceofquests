import os
from pathlib import Path

# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    """Base configuration with sensible defaults."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-this-in-production')
    
    # Supabase config
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')
    
    # Example: SQLAlchemy config if you use it alongside Supabase
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f"sqlite:///{BASE_DIR}/app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security settings
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True

class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    ENV = 'testing'
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL', 'sqlite:///:memory:')

class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'
    # Example: override DB URI for production
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f"sqlite:///{BASE_DIR}/prod.db")

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}

# Helper for app factory pattern
def get_config(env=None):
    """Get configuration class based on environment name."""
    env = env or os.environ.get('FLASK_ENV', 'development')
    return config_by_name.get(env, Config)
