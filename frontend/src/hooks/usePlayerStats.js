import { supabase } from '../api/supabaseClient';

/**
 * Fetches player stats from the database. If stats do not exist, creates a default entry.
 * @param {string} userId - The user ID for which to fetch stats.
 * @returns {Object|null} Player stats data or null if an error occurs.
 */
export async function fetchPlayerStats(userId) {
  if (!userId) {
    throw new Error('Invalid userId: userId is required');
  }

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Row not found: create default stats
        const { data: newStats, error: insertErr } = await supabase
          .from('player_stats')
          .insert({ user_id: userId, xp: 0, level: 1, quests_completed: 0 }) // Default values
          .single();

        if (insertErr) {
          throw new Error(`Error creating default stats: ${insertErr.message}`);
        }

        return newStats;
      }

      throw new Error(`Error fetching stats: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('fetchPlayerStats error:', err);
    return null;
  }
}

/**
 * Updates a player's XP using a Supabase stored procedure.
 * @param {string} userId - The user ID for which to update XP.
 * @param {number} xpGain - The amount of XP to add.
 * @returns {Object|null} Updated data or null if an error occurs.
 */
export async function updatePlayerXP(userId, xpGain) {
  if (!userId || typeof xpGain !== 'number') {
    throw new Error('Invalid input: userId and xpGain are required');
  }

  try {
    const { data, error } = await supabase.rpc('add_xp_to_user', {
      uid_input: userId,
      xp_gain: xpGain,
    });

    if (error) {
      throw new Error(`Error updating XP: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('updatePlayerXP error:', err);
    return null;
  }
}
