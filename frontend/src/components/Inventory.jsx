import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Inventory({ userId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', userId)
        .order('obtained_at', { ascending: false });
      if (error) console.error('Fetch error:', error);
      else setItems(data);
    };
    fetchItems();
  }, [userId]);

  return (
    <div className="p-4 bg-gray-900 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">🎒 Inventory</h2>
      {items.length === 0 ? (
        <p>No items found. Complete a quest to earn loot!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 p-3 rounded-xl border border-purple-500 hover:scale-105 transition-transform"
            >
              <h3 className="text-lg font-semibold">{item.item_name}</h3>
              <p className="text-sm text-purple-300">Realm: {item.realm_id}</p>
              <p className="text-sm text-gray-400">Looted: {new Date(item.obtained_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}