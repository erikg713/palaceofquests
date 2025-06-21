import React from 'react';

export default function MarketplaceItem({ item, onBuy }) {
  const handleBuy = () => {
    if (onBuy) onBuy(item);
  };

  return (
    <div className={`market-item rarity-${item.rarity.toLowerCase()}`}>
      <img src={item.iconUrl} alt={item.name} className="item-img" />
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        <div className="item-type">{item.type}</div>
        <div className="item-price">{item.price} Pi</div>
      </div>
      <button className="buy-button" onClick={handleBuy}>
        Buy
      </button>
    </div>
  );
}

