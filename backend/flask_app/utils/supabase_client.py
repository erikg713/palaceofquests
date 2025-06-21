import os
import logging
from supabase import create_client, Client
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseClient:
    """
    A utility class for managing the Supabase client.
    Ensures secure and validated initialization.
    """
    def __init__(self) -> None:
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.client: Optional[Client] = None
        self._validate_env_variables()
        self._initialize_client()

    def _validate_env_variables(self) -> None:
        """Checks if required environment variables are set."""
        if not self.supabase_url:
            logger.error("SUPABASE_URL environment variable is not set.")
            raise EnvironmentError("SUPABASE_URL environment variable is required.")
        if not self.supabase_key:
            logger.error("SUPABASE_KEY environment variable is not set.")
            raise EnvironmentError("SUPABASE_KEY environment variable is required.")

    def _initialize_client(self) -> None:
        """Initializes the Supabase client."""
        try:
            self.client = create_client(self.supabase_url, self.supabase_key)
            logger.info("Supabase client initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise

    def get_client(self) -> Client:
        """
        Provides the initialized Supabase client.
        
        Returns:
            Client: The initialized Supabase client instance.
        """
        if not self.client:
            logger.error("Supabase client is not initialized.")
            raise RuntimeError("Supabase client is not initialized.")
        return self.client

# Example usage:
# supabase_client = SupabaseClient()
# supabase = supabase_client.get_client()
