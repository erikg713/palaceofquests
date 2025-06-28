"""
Configurations for Flask application.

This module provides a ConfigManager class for performance-optimized,
testable configuration management with minimal global state.

Classes:
    ConfigManager: Handles environment loading and configuration caching
    Config: Base configuration class
    DevelopmentConfig: Development environment overrides
    TestingConfig: Testing environment overrides  
    ProductionConfig: Production environment overrides

Functions:
    get_config: Factory function to get configuration instances
"""

import os
import secrets
from functools import lru_cache
from pathlib import Path
from typing import Dict, Any, Optional, Type


class ConfigManager:
    """Manages configuration loading and caching for performance and testability."""
    
    def __init__(self, env_file_path: Optional[Path] = None, load_env: bool = True):
        """
        Initialize ConfigManager.
        
        Args:
            env_file_path: Path to .env file. If None, uses default location.
            load_env: Whether to load environment variables from file.
        """
        self._env_cache: Dict[str, str] = {}
        self._env_loaded = False
        self.env_file_path = env_file_path or Path(__file__).parent.parent.parent / '.env'
        
        if load_env:
            self.load_environment()
    
    def load_environment(self) -> None:
        """Load environment variables from .env file if it exists."""
        if self._env_loaded:
            return
            
        try:
            from dotenv import load_dotenv
            if self.env_file_path.exists():
                load_dotenv(dotenv_path=self.env_file_path)
        except ImportError:
            # dotenv not available, skip loading
            pass
        finally:
            self._env_loaded = True
    
    @lru_cache(maxsize=128)
    def get_env(self, key: str, default: str = '') -> str:
        """
        Get environment variable with caching for performance.
        
        Args:
            key: Environment variable name
            default: Default value if not found
            
        Returns:
            Environment variable value or default
        """
        # Check cache first
        if key in self._env_cache:
            return self._env_cache[key]
            
        # Get from environment and cache it
        value = os.environ.get(key, default)
        self._env_cache[key] = value
        return value
    
    def get_env_bool(self, key: str, default: bool = False) -> bool:
        """Get boolean environment variable."""
        value = self.get_env(key, str(default)).lower()
        return value in ('true', '1', 'yes', 'on')
    
    def get_env_int(self, key: str, default: int = 0) -> int:
        """Get integer environment variable."""
        try:
            return int(self.get_env(key, str(default)))
        except ValueError:
            return default
    
    def clear_cache(self) -> None:
        """Clear environment variable cache."""
        self._env_cache.clear()
        self.get_env.cache_clear()


# Global config manager instance (lazy-loaded)
_config_manager: Optional[ConfigManager] = None


def get_config_manager() -> ConfigManager:
    """Get or create the global config manager instance."""
    global _config_manager
    if _config_manager is None:
        _config_manager = ConfigManager()
    return _config_manager


class Config:
    """Base configuration class with performance optimizations."""
    
    def __init__(self, config_manager: Optional[ConfigManager] = None):
        """Initialize configuration with optional config manager."""
        self._config_manager = config_manager or get_config_manager()
        self._setup_config()
    
    def _setup_config(self) -> None:
        """Setup configuration values."""
        # General Config
        self.SECRET_KEY = self._get_secret_key()
        self.SESSION_COOKIE_SECURE = True
        self.SESSION_COOKIE_HTTPONLY = True
        self.SESSION_COOKIE_SAMESITE = 'Lax'
        self.PERMANENT_SESSION_LIFETIME = 60 * 60 * 24  # 1 day in seconds

        # Database - Supabase configuration
        self.SUPABASE_URL = self._config_manager.get_env('SUPABASE_URL')
        self.SUPABASE_KEY = self._config_manager.get_env('SUPABASE_KEY')

        # Pi Network Integration
        self.PI_API_KEY = self._config_manager.get_env('PI_API_KEY')
        self.PI_API_URL = self._config_manager.get_env('PI_API_URL', 'https://api.minepi.com/v2/')

        # Other Configurations
        self.DEBUG = False
        self.TESTING = False
        self.ENV = 'production'
    
    def _get_secret_key(self) -> str:
        """Get or generate SECRET_KEY in a testable way."""
        secret_key = self._config_manager.get_env('SECRET_KEY')
        if not secret_key:
            # Generate a deterministic key for testing, random for production
            if self._config_manager.get_env('FLASK_ENV') == 'testing':
                return 'test-secret-key-do-not-use-in-production'
            else:
                return secrets.token_hex(32)
        return secret_key
    
    def validate(self) -> None:
        """Validate configuration values."""
        required_keys = []
        missing_keys = []
        
        # Check for required environment variables in production
        if self.ENV == 'production':
            required_keys = ['SECRET_KEY', 'SUPABASE_URL', 'SUPABASE_KEY']
            missing_keys = [key for key in required_keys 
                          if not getattr(self, key, None)]
        
        if missing_keys:
            raise ValueError(f"Missing required configuration: {', '.join(missing_keys)}")


class DevelopmentConfig(Config):
    """Development environment configuration."""
    
    def _setup_config(self) -> None:
        super()._setup_config()
        self.ENV = 'development'
        self.DEBUG = True
        self.SESSION_COOKIE_SECURE = False  # For local testing


class TestingConfig(Config):
    """Testing environment configuration."""
    
    def _setup_config(self) -> None:
        super()._setup_config()
        self.ENV = 'testing'
        self.TESTING = True
        self.DEBUG = True
        self.SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
        self.SESSION_COOKIE_SECURE = False


class ProductionConfig(Config):
    """Production environment configuration."""
    
    def _setup_config(self) -> None:
        super()._setup_config()
        self.ENV = 'production'
        self.DEBUG = False


# Configuration class mapping for easy access
CONFIG_CLASSES: Dict[str, Type[Config]] = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
}


def get_config(config_name: str = 'production', 
               config_manager: Optional[ConfigManager] = None) -> Config:
    """
    Factory function to get configuration instances.
    
    Args:
        config_name: Name of configuration ('development', 'production', 'testing')
        config_manager: Optional config manager instance
        
    Returns:
        Configuration instance
        
    Raises:
        ValueError: If config_name is not recognized
    """
    if config_name not in CONFIG_CLASSES:
        raise ValueError(f"Unknown configuration: {config_name}. "
                        f"Available: {', '.join(CONFIG_CLASSES.keys())}")
    
    config_class = CONFIG_CLASSES[config_name]
    config = config_class(config_manager)
    config.validate()
    return config


# Backwards compatibility - maintain existing interface
config_by_name = CONFIG_CLASSES