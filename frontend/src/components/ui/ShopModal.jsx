import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

export default function ShopModal({ userId, onClose }) {
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('market_items')
      .select('id, price, items(*)')
      .order('price', { ascending: true });

    if (error) console.error(error);
    else setShopItems(data);
    setLoading(false);
  };

  const handleBuyWithPi = async (item) => {
    if (!window.Pi) {
      alert("Pi SDK not loaded");
      return;
    }

    window.Pi.createPayment({
      amount: item.price,
      memo: `Purchase: ${item.items.name}`,
      metadata: { item_id: item.items.id },
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
        alert(`✅ Purchased ${item.items.name} with Pi!`);
      },
      onCancel(paymentId) {
        console.log('Cancelled', paymentId);
      },
      onError(error, paymentId) {
        console.error('Payment error', error, paymentId);
        alert('❌ Payment failed');
      }
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-content shop-modal">
        <h2>🛒 Pi Shop</h2>
        <button className="close-button" onClick={onClose}>X</button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="shop-items">
            {shopItems.map((m) => (
              <div key={m.id} className="shop-item">
                <img src={m.items.icon_url} alt={m.items.name} />
                <div>{m.items.name}</div>
                <div>{m.price} Pi</div>
                <button onClick={() => handleBuyWithPi(m)}>Pay with Pi</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
