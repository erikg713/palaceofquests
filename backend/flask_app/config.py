import os
from pathlib import Path
import os
from dotenv import load_dotenv
from pathlib import Path

# Load from .env
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret")
    PI_API_KEY = os.getenv("PI_API_KEY")
    PI_WALLET_PRIVATE_SEED = os.getenv("PI_WALLET_PRIVATE_SEED")
    PI_NETWORK = os.getenv("PI_NETWORK", "Pi Testnet")

class DevConfig(Config):
    DEBUG = True

class ProdConfig(Config):
    DEBUG = False

# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    """Base configuration with sensible defaults."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-this-in-production')
    
    # Supabase config
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')
        
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
