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
