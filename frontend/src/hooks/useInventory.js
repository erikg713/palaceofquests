// src/hooks/useUserInventory.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useUserInventory = (userId) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', userId);

      if (error) console.error(error);
      else setInventory(data);
      setLoading(false);
    };

    fetchInventory();
  }, [userId]);

  const addItem = async (item) => {
    const { data, error } = await supabase
      .from('inventory')
      .insert([{ ...item, user_id: userId }]);
    if (error) console.error(error);
    else setInventory([...inventory, data[0]]);
  };

  return { inventory, loading, addItem };
};
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

const useInventory = (userId) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
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
        .select("qty, id, items(*)")
        .eq("user_id", userId);

      if (error) throw error;

      setInventory(
        (data || []).map((entry) => ({
          ...entry.items,
          qty: entry.qty,
          id: entry.id, // Use inventory id for uniqueness
        }))
      );
    } catch (err) {
      setError(err.message || "Could not fetch inventory");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return { inventory, loading, error };
};

export default useInventory;
