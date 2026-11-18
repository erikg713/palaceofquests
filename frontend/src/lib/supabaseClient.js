// src/lib/supabaseClient.js
//
// The canonical Supabase client. When VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY are not configured (local play, no backend yet),
// `supabase` is null and `isSupabaseConfigured` is false — callers must
// check and fall back to local data instead of crashing at import time.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export default supabase;
