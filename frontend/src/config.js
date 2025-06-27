const ENV = import.meta.env.MODE || "development";

const CONFIG = {
  // Flask backend base URL
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    (ENV === "production"
      ? "https://your-production-url.com"
      : "http://localhost:5000"),

  // Pi Network settings
  PI_APP_ID: import.meta.env.VITE_PI_APP_ID || "your.pi.app.id",
  PI_API_ENDPOINT: "https://api.minepi.com",

  // Supabase config (used in supabaseClient.js instead)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
};

// Runtime validation
if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) {
  console.error("Supabase configuration is missing!");
}
if (!CONFIG.PI_APP_ID) {
  console.error("Pi Network App ID is missing!");
}

export default CONFIG;
