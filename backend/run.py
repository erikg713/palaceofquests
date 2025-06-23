import os
import logging
from flask_app import create_app

# Configure logging with timestamps and log level
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def get_env_variable(var_name, default_value=None, required=False):
    """
    Fetches an environment variable and provides validation.
    Parameters:
        var_name (str): The name of the environment variable to fetch.
        default_value (Any): The default value to use if the variable is not set.
        required (bool): Whether the variable is required.
    Returns:
        Any: The value of the environment variable, or the default value.
    Raises:
        ValueError: If the environment variable is required but not set.
    """
    value = os.getenv(var_name, default_value)
    if required and value is None:
        raise ValueError(f"The required environment variable '{var_name}' is not set.")
    return value


# Entry point for the application
if __name__ == "__main__":
    logging.info("Starting Flask application...")

    # Load configurations
    try:
        debug_mode = get_env_variable("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
        host = get_env_variable("FLASK_HOST", "127.0.0.1")
        port = int(get_env_variable("FLASK_PORT", 5000))
    except ValueError as e:
        logging.error(f"Configuration error: {e}")
        raise SystemExit(e)
    except Exception as e:
        logging.error(f"Unexpected error during configuration: {e}")
        raise

    # Create the Flask app
    app = create_app()

    # Start the Flask application
    try:
        logging.info(f"Flask application is running on {host}:{port} (debug={debug_mode})")
        app.run(host=host, port=port, debug=debug_mode)
    except Exception as e:
        logging.exception("An error occurred while starting the application")
        raise
