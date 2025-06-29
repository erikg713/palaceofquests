import React, { useEffect, useState } from 'react';
import MarketplaceItem from '../components/MarketplaceItem';
import { supabase } from '../api/supabaseClient';
import { buyMarketItem } from '../hooks/marketActions';
import { Pi } from '@pi-apps/pi-sdk'; // if not globally loaded

const handleBuyWithPi = async (item, userId) => {
  Pi.createPayment({
    amount: item.price,
    memo: `Purchase: ${item.name}`,
    metadata: { item_id: item.id },
    onReadyForServerApproval: async (paymentId) => {
      await fetch('/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      await fetch('/payment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, txid }),
      });

      // Optionally update local inventory or refetch
      alert(`✅ Bought ${item.name} with Pi!`);
    },
    onCancel: (paymentId) => {
      console.log('Payment cancelled:', paymentId);
    },
    onError: (err, paymentId) => {
      console.error('Pi SDK Error:', err);
    }
  });
};

export default function Marketplace({ userId }) {
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketItems = async () => {
    const { data, error } = await supabase
      .from('market_items')
      .select('id, price, items(*)') // include item details
      .order('price', { ascending: true });

    if (error) {
      console.error('Market fetch error:', error);
    } else {
      setMarketItems(data);
    }

    setLoading(false);
  };

  const handleBuy = async (marketItem) => {
    try {
      await buyMarketItem(userId, marketItem);
      alert(`✅ Purchased ${marketItem.items.name} for ${marketItem.price} Pi`);
    } catch (err) {
      console.error(err);
      alert('❌ Purchase failed');
    }
  };

  useEffect(() => {
    fetchMarketItems();
  }, []);

  return (
    <div className="marketplace-page">
      <h2>🛒 Marketplace</h2>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="marketplace-grid">
          {marketItems.map((m) => (
            <MarketplaceItem
              key={m.id}
              item={{ ...m.items, price: m.price }}
              onBuy={() => handleBuy(m)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
