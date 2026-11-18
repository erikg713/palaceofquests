import React, { useState } from 'react';
import MarketplaceItem from '../components/MarketplaceItem';
import PiPaymentButton from '../components/PiPaymentButton';
import { inventoryData } from '../data/items';

// Marketplace prices by rarity (Pi). The catalog is the game's own item
// data; prices are local until the backend market_items table is connected.
const PRICE_BY_RARITY = {
  common: 1,
  rare: 2,
  epic: 5,
  legendary: 10,
};

function catalog() {
  return Object.entries(inventoryData).flatMap(([category, items]) =>
    items.map((item) => ({
      ...item,
      type: category,
      price: PRICE_BY_RARITY[item.rarity] ?? 1,
      // No item art ships with the app yet; the card renders the item icon.
      iconUrl: '',
    }))
  );
}

export default function Marketplace() {
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const items = catalog();

  const handleBuy = (item) => {
    setSelected(item);
    setNotice('');
  };

  const handlePaymentComplete = () => {
    if (selected) {
      setNotice(`Bought ${selected.name} for ${selected.price} Pi.`);
      setSelected(null);
    }
  };

  return (
    <div className="marketplace-page py-8">
      <h2>🛒 Marketplace</h2>
      <p className="text-sm text-gray-400 mb-4">
        The palace market — prices in Pi. Purchases pay through Pi Browser;
        server approval needs the backend, so a purchase completes in-app up
        to that step until the backend is connected.
      </p>
      {notice && (
        <div className="notice mb-4" role="status">
          {notice}
        </div>
      )}
      {selected && (
        <div className="palace-card mb-4">
          <p>
            Buying <strong>{selected.name}</strong> for{' '}
            <strong>{selected.price} Pi</strong>
          </p>
          <PiPaymentButton
            amount={selected.price}
            memo={`Purchase: ${selected.name}`}
            metadata={{ item_id: selected.id }}
            onPaymentComplete={handlePaymentComplete}
          />
          <button
            className="quest-button secondary ml-3"
            onClick={() => setSelected(null)}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="marketplace-grid">
        {items.map((item) => (
          <MarketplaceItem key={item.id} item={item} onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
}
