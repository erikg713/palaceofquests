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
