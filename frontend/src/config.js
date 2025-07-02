// config.js

// Determine the current environment
const ENV = import.meta.env.MODE || 'development';

// Default configuration (fallback values)
const DEFAULTS = {
  API_BASE_URL: 'http://localhost:5000',
  PI_API_ENDPOINT: 'https://api.minepi.com',
  PI_APP_ID: 'your.pi.app.id',
  SUPABASE_URL: '',
  SUPABASE_KEY: '',
};

// Configuration object
const CONFIG = {
  // Flask backend base URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (ENV === 'production' ? 'https://your-production-url.com' : DEFAULTS.API_BASE_URL),

  // Pi Network settings
  PI_APP_ID: import.meta.env.VITE_PI_APP_ID || DEFAULTS.PI_APP_ID,
  PI_API_ENDPOINT: DEFAULTS.PI_API_ENDPOINT,

  // Supabase config
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || DEFAULTS.SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULTS.SUPABASE_KEY,
};

// Runtime validation for critical configurations
function validateConfig() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) {
    throw new Error("Supabase configuration is missing! Please check your environment variables.");
  }
  if (!CONFIG.PI_APP_ID) {
    throw new Error("Pi Network App ID is missing! Please check your environment variables.");
  }
}

// Immediately validate the configuration
validateConfig();

export default CONFIG;
