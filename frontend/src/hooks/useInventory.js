import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Hook to fetch and manage a user's inventory from Supabase.
 * @param {string} userId
 */
const useInventory = (userId) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInventory = useCallback(async () => {
    if (!userId) {
      setInventory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("id, qty, items(*)")
        .eq("user_id", userId);

      if (error) throw error;

      setInventory(
        Array.isArray(data)
          ? data.map((entry) => ({
              ...entry.items,
              qty: entry.qty,
              invId: entry.id, // inventory record id
            }))
          : []
      );
    } catch (err) {
      setError(err.message || "Could not fetch inventory.");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    refresh: fetchInventory, // for manual refresh after mutations
  };
};

export default useInventory;
