import { supabase } from "../api/supabaseClient";

export async function fetchPlayerStats(userId) {
  const { data, error } = await supabase
    .from("player_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Row not found: create default
      const { data: newStats, error: insertErr } = await supabase
        .from("player_stats")
        .insert({ user_id: userId })
        .single();
      return newStats;
    }
    console.error("Stats fetch error:", error);
    return null;
  }

  return data;
}

export async function updatePlayerXP(userId, xpGain) {
  const { data, error } = await supabase.rpc("add_xp_to_user", {
    uid_input: userId,
    xp_gain: xpGain,
  });
  if (error) console.error("XP update error:", error);
  return data;
}
