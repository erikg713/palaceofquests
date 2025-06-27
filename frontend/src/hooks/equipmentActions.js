import { supabase } from "../api/supabaseClient";

export async function equipItem(userId, item) {
  const { error } = await supabase.from("equipment").upsert({
    user_id: userId,
    slot: item.type, // e.g., 'weapon'
    item_id: item.id,
  });

  if (error) console.error("Equip Error:", error);
}
