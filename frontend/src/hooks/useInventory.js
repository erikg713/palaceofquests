// frontend/src/hooks/useInventory.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Custom React hook for managing user inventory with Supabase.
 * @param {string} userId - The unique user identifier.
 * @returns {{
 *   inventory: Array,
 *   loading: boolean,
 *   error: string,
 *   refresh: Function
 * }}
 */
const useInventory = (userId) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch inventory from Supabase
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
        .select("qty, id, items(*)")
        .eq("user_id", userId);

      if (error) throw error;

      setInventory(
        Array.isArray(data)
          ? data.map(entry => ({
              ...entry.items,
              qty: entry.qty,
              id: entry.id,
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

  // Load inventory on mount or when userId changes
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    refresh: fetchInventory, // Expose refresh for manual reloads (e.g., after using/selling items)
  };
};

export default useInventory;
