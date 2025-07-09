"""
Custom error classes and error handlers
"""

class ValidationError(Exception):
    """Custom validation error"""
    pass

class AuthenticationError(Exception):
    """Custom authentication error"""
    pass

class InsufficientFundsError(Exception):
    """Custom insufficient funds error"""
    pass

def register_error_handlers(app):
    """Register custom error handlers"""
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return {'error': str(e)}, 400
    
    @app.errorhandler(AuthenticationError)
    def handle_auth_error(e):
        return {'error': str(e)}, 401
    
    @app.errorhandler(InsufficientFundsError)
    def handle_insufficient_funds_error(e):
        return {'error': str(e)}, 400
    
    @app.errorhandler(404)
    def handle_not_found(e):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def handle_internal_error(e):
        return {'error': 'Internal server error'}, 500
