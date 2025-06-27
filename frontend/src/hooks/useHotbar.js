import { supabase } from "../api/supabaseClient";

export async function fetchHotbar(userId) {
  const { data, error } = await supabase
    .from("hotbar")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Hotbar fetch error:", error);
    return [];
  }

  return data;
}

export async function updateHotbarSlot(userId, slotIndex, itemId) {
  const { error } = await supabase
    .from("hotbar")
    .upsert({ user_id: userId, slot_index: slotIndex, item_id: itemId });

  if (error) console.error("Hotbar update error:", error);
}
e;
