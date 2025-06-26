import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import ItemCard from '../components/ItemCard';
import ItemDetailModal from '../components/ItemDetailModal';

export default function Inventory({ userId }) {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('qty, items(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Inventory fetch error:', error);
    } else {
      const formatted = data.map((i) => ({
        ...i.items,
        qty: i.qty,
      }));
      setInventory(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchInventory();
  }, [userId]);

  const handleCloseModal = () => {
    setSelectedItem(null);
    fetchInventory(); // Refresh after use/sell
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div className="inventory-page">
      <h2>🎒 Inventory</h2>
      <div className="inventory-grid">
        {inventory.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          userId={userId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
import React, { useEffect, useState, useContext } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';

export default function InventoryPage() {
  const { piUser } = useContext(PiWalletContext);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!piUser?.uid) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory/${piUser.uid}`)
      .then(res => res.json())
      .then(data => setInventory(data));
  }, [piUser]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-4">🎒 Your Inventory</h2>
      {inventory.length === 0 ? (
        <p>No items yet. Complete quests or buy from the market.</p>
      ) : (
        <ul className="space-y-2">
          {inventory.map((item) => (
            <li key={item.id} className="bg-gray-800 p-3 rounded shadow">
              <strong>{item.item_name}</strong> — from <em>{item.realm_id}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
