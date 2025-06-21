import os
import logging
from flask_app import create_app

# Create the Flask app
app = create_app()

# Entry point for the application
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logging.info("Initializing Flask application...")

    # Read configuration from environment variables
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", 5000))

    # Start the Flask application
    try:
        app.run(host=host, port=port, debug=debug_mode)
    except Exception as e:
        logging.error(f"An error occurred while starting the application: {e}")
        raise
