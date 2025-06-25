const CONFIG = {
  // Flask backend base URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',

  // Pi Network settings
  PI_APP_ID: import.meta.env.VITE_PI_APP_ID || 'your.pi.app.id',
  PI_API_ENDPOINT: 'https://api.minepi.com',

  // Supabase config (used in supabaseClient.js instead)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
};

export default CONFIG;
