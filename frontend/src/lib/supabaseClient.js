// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

/**
 * Gets required env variables, throws if not found.
 * @param {string} key - The environment variable key.
 * @returns {string} - The environment variable value.
 */
function getEnv(key) {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing.`);
  }
  return value;
}

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Optionally, provide a default export for flexibility.
export default supabase;
