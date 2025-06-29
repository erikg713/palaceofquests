import { supabase } from '../api/supabaseClient';

/**
 * Equips an item for a user by updating the equipment table.
 * @param {string|number} userId - The unique user identifier.
 * @param {Object} item - The item object to equip.
 * @param {string} item.type - The equipment slot type (e.g., 'weapon').
 * @param {string|number} item.id - The item ID.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function equipItem(userId, item) {
  if (!userId || !item || !item.type || !item.id) {
    return { success: false, error: new Error('Invalid parameters for equipItem') };
  }

  try {
    const { error } = await supabase
      .from('equipment')
      .upsert({
        user_id: userId,
        slot: item.type,
        item_id: item.id,
      });

    if (error) {
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}
