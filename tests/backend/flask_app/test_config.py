"""
Simple tests for the config module that bypass import issues.
"""

import os
import sys
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock
import pytest
import importlib.util

# Direct import of the config module
def load_config_module():
    """Load the config module directly to avoid dependency issues."""
    config_path = Path(__file__).parent.parent.parent.parent / 'backend' / 'flask_app' / 'config.py'
    spec = importlib.util.spec_from_file_location('config', config_path)
    config_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(config_module)
    return config_module

# Load config at module level
config = load_config_module()

class TestConfigManager:
    """Test ConfigManager functionality."""
    
    def test_init_default(self):
        """Test ConfigManager initialization with defaults."""
        manager = config.ConfigManager(load_env=False)
        assert manager._env_cache == {}
        assert manager._env_loaded is False
        assert isinstance(manager.env_file_path, Path)
    
    def test_get_env_basic(self):
        """Test basic environment variable retrieval."""
        manager = config.ConfigManager(load_env=False)
        
        with patch.dict(os.environ, {'TEST_KEY': 'test_value'}):
            result = manager.get_env('TEST_KEY')
            assert result == 'test_value'
    
    def test_get_env_with_default(self):
        """Test environment variable retrieval with default."""
        manager = config.ConfigManager(load_env=False)
        
        result = manager.get_env('NONEXISTENT_KEY', 'default_value')
        assert result == 'default_value'
    
    def test_get_env_bool(self):
        """Test boolean environment variable parsing."""
        manager = config.ConfigManager(load_env=False)
        
        test_cases = [
            ('true', True),
            ('False', False),
            ('1', True),
            ('0', False),
        ]
        
        for env_value, expected in test_cases:
            with patch.dict(os.environ, {'BOOL_TEST': env_value}):
                manager.clear_cache()
                result = manager.get_env_bool('BOOL_TEST')
                assert result == expected
    
    def test_clear_cache(self):
        """Test cache clearing functionality."""
        manager = config.ConfigManager(load_env=False)
        
        with patch.dict(os.environ, {'CLEAR_TEST': 'original'}):
            # Cache a value
            manager.get_env('CLEAR_TEST')
            assert 'CLEAR_TEST' in manager._env_cache
            
            # Clear cache
            manager.clear_cache()
            assert 'CLEAR_TEST' not in manager._env_cache


class TestConfig:
    """Test Config class functionality."""
    
    def test_config_initialization(self):
        """Test Config class initialization."""
        manager = config.ConfigManager(load_env=False)
        config_obj = config.Config(config_manager=manager)
        
        assert hasattr(config_obj, 'SECRET_KEY')
        assert hasattr(config_obj, 'SESSION_COOKIE_SECURE')
        assert config_obj.ENV == 'production'
        assert config_obj.DEBUG is False
    
    def test_development_config(self):
        """Test DevelopmentConfig settings."""
        manager = config.ConfigManager(load_env=False)
        dev_config = config.DevelopmentConfig(config_manager=manager)
        
        assert dev_config.ENV == 'development'
        assert dev_config.DEBUG is True
        assert dev_config.SESSION_COOKIE_SECURE is False
    
    def test_testing_config(self):
        """Test TestingConfig settings."""
        manager = config.ConfigManager(load_env=False)
        test_config = config.TestingConfig(config_manager=manager)
        
        assert test_config.ENV == 'testing'
        assert test_config.TESTING is True
        assert test_config.DEBUG is True
    
    def test_secret_key_testing_mode(self):
        """Test SECRET_KEY generation for testing environment."""
        manager = config.ConfigManager(load_env=False)
        
        with patch.dict(os.environ, {'FLASK_ENV': 'testing'}):
            config_obj = config.Config(config_manager=manager)
            assert config_obj.SECRET_KEY == 'test-secret-key-do-not-use-in-production'


class TestFactoryFunctions:
    """Test factory functions."""
    
    def test_get_config_valid_names(self):
        """Test get_config with valid configuration names."""
        manager = config.ConfigManager(load_env=False)
        
        # Test non-production configs (to avoid validation issues)
        for name in ['development', 'testing']:
            config_obj = config.get_config(name, config_manager=manager)
            assert config_obj.ENV == name
    
    def test_get_config_invalid_name(self):
        """Test get_config with invalid configuration name."""
        manager = config.ConfigManager(load_env=False)
        
        with pytest.raises(ValueError) as exc_info:
            config.get_config('invalid_config', config_manager=manager)
        
        assert "Unknown configuration: invalid_config" in str(exc_info.value)


class TestPerformance:
    """Test performance characteristics."""
    
    def test_environment_variable_caching(self):
        """Test that environment variables are cached for performance."""
        manager = config.ConfigManager(load_env=False)
        
        with patch('os.environ.get') as mock_get:
            mock_get.return_value = 'test_value'
            
            # First call
            result1 = manager.get_env('PERF_TEST')
            # Second call
            result2 = manager.get_env('PERF_TEST')
            
            # os.environ.get should only be called once due to caching
            assert mock_get.call_count == 1
            assert result1 == result2 == 'test_value'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])