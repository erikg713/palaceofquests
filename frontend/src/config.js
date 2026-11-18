// config.js — centralized app config.
//
// Missing values are NOT fatal: the game runs on local data when no backend
// or Supabase project is configured, and logs one warning instead of
// crashing at import time. Callers check the flags before using a service.

const ENV = import.meta.env.MODE || 'development';

const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  PI_APP_ID: import.meta.env.VITE_PI_APP_ID || '',
  PI_API_ENDPOINT: 'https://api.minepi.com',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const isBackendConfigured = Boolean(
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== 'http://localhost:5000'
);
export const isSupabaseConfigured =
  Boolean(CONFIG.SUPABASE_URL) && Boolean(CONFIG.SUPABASE_KEY);

if (typeof window !== 'undefined' && ENV !== 'test') {
  if (!isSupabaseConfigured) {
    console.warn(
      '[Config] Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
        'The game runs on local data until a project is connected.'
    );
  }
  if (!CONFIG.PI_APP_ID) {
    console.warn(
      '[Config] VITE_PI_APP_ID is not set. Pi sign-in still works in Pi Browser; ' +
        'server-side verification needs the app id.'
    );
  }
}

export default CONFIG;
