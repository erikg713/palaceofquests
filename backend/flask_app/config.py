import os
from pathlib import Path
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.DEBUG if os.getenv('FLASK_ENV') == 'development' else logging.INFO)

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    """Base configuration with sensible defaults."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-this-in-production')
    
    # Supabase config
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    
    # Security settings
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'True').lower() == 'true'
    REMEMBER_COOKIE_SECURE = os.getenv('REMEMBER_COOKIE_SECURE', 'True').lower() == 'true'

class DevelopmentConfig(Config):
    """Configuration for development environment."""
    DEBUG = True
    ENV = 'development'

class TestingConfig(Config):
    """Configuration for testing environment."""
    TESTING = True
    DEBUG = True
    ENV = 'testing'
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URL', 'sqlite:///:memory:')

class ProductionConfig(Config):
    """Configuration for production environment."""
    DEBUG = False
    ENV = 'production'
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f"sqlite:///{BASE_DIR}/prod.db")

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}

def get_config(env=None):
    """Get configuration class based on environment name."""
    env = env or os.getenv('FLASK_ENV', 'development')
    config = config_by_name.get(env.lower())
    if not config:
        raise ValueError(f"Invalid FLASK_ENV: {env}. Must be one of {list(config_by_name.keys())}.")
    return config
