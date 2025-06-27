import React, { useEffect, useState } from "react";
import MarketplaceItem from "./MarketplaceItem"; // from your earlier component
import { buyMarketItem } from "../hooks/marketActions"; // to implement

export default function VendorModal({ userId, onClose }) {
  const [marketItems, setMarketItems] = useState([]);

  useEffect(() => {
    fetch("/api/market_items")
      .then((res) => res.json())
      .then(setMarketItems)
      .catch(console.error);
  }, []);

  const handleBuy = async (item) => {
    await buyMarketItem(userId, item);
    alert(`Purchased ${item.name} for ${item.price} Pi!`);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content vendor-modal">
        <h2>Marketplace</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="marketplace-list">
          {marketItems.map((mi) => (
            <MarketplaceItem key={mi.id} item={mi} onBuy={handleBuy} />
          ))}
        </div>
      </div>
    </div>
  );
}
