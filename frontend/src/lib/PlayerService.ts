import { supabase } from './supabase';

/**
 * Retrieves a player profile by their Pi Network UID.
 * @param pi_uid - The unique Pi Network user identifier.
 * @returns The player profile object, or null if not found or on error.
 * @throws Will propagate unexpected Supabase errors.
 */
export async function fetchPlayerProfile(pi_uid: string): Promise<Record<string, any> | null> {
  if (!pi_uid?.trim()) {
    console.warn('[PlayerService] fetchPlayerProfile called with empty pi_uid');
    return null;
  }

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('pi_uid', pi_uid)
    .single();

  if (error) {
    // Log full error for diagnostics; can integrate with external monitoring here
    console.error(`[PlayerService] Failed to fetch player for pi_uid=${pi_uid}: ${error.message}`);
    return null;
  }

  return data ?? null;
}
