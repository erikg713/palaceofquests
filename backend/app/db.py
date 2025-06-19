import os
import logging
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

# Validate environment variables
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL or Anon Key is missing from environment variables.")

# Initialize logging
logging.basicConfig(level=logging.INFO)
logging.info("Initializing Supabase client...")

# Initialize Supabase client
supabase = create_client(supabase_url, supabase_key)
logging.info("Supabase client initialized successfully.")

# Utility function for fetching data
def fetch_data(table_name):
    """
    Fetches all data from a given table.
    
    Parameters:
        table_name (str): Name of the table to fetch data from.
        
    Returns:
        dict: Data fetched from the table.
    """
    try:
        return supabase.table(table_name).select("*").execute()
    except Exception as e:
        logging.error(f"Error fetching data from table {table_name}: {e}")
        raise
