// src/lib/supabaseClient.js import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// src/hooks/useUserInventory.js import { useEffect, useState } from 'react'; import { supabase } from '../lib/supabaseClient';

export const useUserInventory = (userId) => { const [inventory, setInventory] = useState([]); const [loading, setLoading] = useState(true);

useEffect(() => { const fetchInventory = async () => { if (!userId) return; const { data, error } = await supabase .from('inventory') .select('*') .eq('user_id', userId);

if (error) console.error(error);
  else setInventory(data);
  setLoading(false);
};

fetchInventory();

}, [userId]);

const addItem = async (item) => { const { data, error } = await supabase .from('inventory') .insert([{ ...item, user_id: userId }]); if (error) console.error(error); else setInventory([...inventory, data[0]]); };

return { inventory, loading, addItem }; };

// Add to PiPaymentButton.jsx (or callback in ItemCard) import { useUserInventory } from '../hooks/useUserInventory';

const { addItem } = useUserInventory(userId); // userId must come from Supabase Auth

<PiPaymentButton amount={1} memo={Buy ${item.name}} metadata={{ itemId: item.id, type: 'purchase' }} onPaymentComplete={() => { alert(${item.name} purchased with Pi!); onEquip(item); addItem({ id: item.id, name: item.name, rarity: item.rarity, icon: item.icon }); }} />

