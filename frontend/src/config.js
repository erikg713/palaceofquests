// config.js

// Identify the current environment
const ENV = import.meta.env.MODE || 'development';

// Centralized defaults (only used for local development)
const DEFAULTS = {
  API_BASE_URL: 'http://localhost:5000',
  PI_API_ENDPOINT: 'https://api.minepi.com',
  PI_APP_ID: '',
  SUPABASE_URL: '',
  SUPABASE_KEY: '',
};

// Helper to get config value, fallback to default in development only
function getConfig(envVar, defaultKey) {
  const value = import.meta.env[envVar];
  if (typeof value !== 'undefined' && value !== '') return value;
  if (ENV === 'development') return DEFAULTS[defaultKey];
  return '';
}

const CONFIG = {
  API_BASE_URL: getConfig('VITE_API_BASE_URL', 'API_BASE_URL'),
  PI_APP_ID: getConfig('VITE_PI_APP_ID', 'PI_APP_ID'),
  PI_API_ENDPOINT: DEFAULTS.PI_API_ENDPOINT,
  SUPABASE_URL: getConfig('VITE_SUPABASE_URL', 'SUPABASE_URL'),
  SUPABASE_KEY: getConfig('VITE_SUPABASE_ANON_KEY', 'SUPABASE_KEY'),
};

// Runtime validation: throw if critical config is missing
function validateConfig(cfg) {
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) {
    throw new Error(
      '[Config Error] Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }
  if (!cfg.PI_APP_ID) {
    throw new Error(
      '[Config Error] Pi Network App ID is missing. Please set VITE_PI_APP_ID in your environment.'
    );
  }
}

// Only validate in runtime (not during tests/builds)
if (typeof window !== 'undefined') {
  validateConfig(CONFIG);
}

export default CONFIG;
