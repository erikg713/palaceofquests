import { supabase } from "../api/supabaseClient";

export async function useItem(item, userId) {
  // Example: decrease quantity in Supabase
  const { data, error } = await supabase
    .from("inventory")
    .update({ qty: item.qty - 1 })
    .eq("user_id", userId)
    .eq("item_id", item.id);

  if (error) console.error("Use Item Error:", error);
  return data;
}

export async function sellItem(item, userId) {
  // Example: add Pi balance + reduce item qty
  // Step 1: Add Pi reward to user
  await supabase.rpc("add_coins_to_user", {
    user_id_input: userId,
    coins_to_add: item.sellValue,
  });

  // Step 2: Decrease item count
  const { error } = await supabase
    .from("inventory")
    .update({ qty: item.qty - 1 })
    .eq("user_id", userId)
    .eq("item_id", item.id);

  if (error) console.error("Sell Item Error:", error);
}
