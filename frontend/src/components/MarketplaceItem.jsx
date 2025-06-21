import React from 'react';

export default function MarketplaceItem({ item, onBuy }) {
  const handleBuy = () => {
    if (onBuy) onBuy(item);
  };

  // Destructure for readability
  const { name, type, price, rarity, iconUrl } = item;

  return (
    <div
      className={`market-item rarity-${rarity.toLowerCase()}`}
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: 20,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
        minWidth: 340,
        maxWidth: 420,
        margin: 'auto',
        marginBottom: 24,
      }}
      tabIndex={0}
      aria-label={`Marketplace Item: ${name}, ${type}, ${price} Pi, rarity ${rarity}`}
    >
      <img
        src={iconUrl}
        alt={name}
        className="item-img"
        style={{
          width: 64,
          height: 64,
          objectFit: 'cover',
          borderRadius: 12,
          border: `2px solid var(--rarity-${rarity.toLowerCase()}-color, #bbb)`,
          background: '#f8f8f8',
        }}
      />
      <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
        <div
          className="item-name"
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#222',
            marginBottom: 2,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          title={name}
        >
          {name}
        </div>
        <div
          className="item-type"
          style={{
            fontSize: 14,
            color: '#888',
            marginBottom: 8,
          }}
        >
          {type}
        </div>
        <div
          className="item-price"
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#555',
            marginBottom: 2,
          }}
        >
          <span role="img" aria-label="currency">💰</span> {price} Pi
        </div>
      </div>
      <button
        className="buy-button"
        onClick={handleBuy}
        style={{
          background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 0.2s, transform 0.1s',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
        onMouseUp={e => e.currentTarget.style.transform = ''}
        onBlur={e => e.currentTarget.style.transform = ''}
        aria-label={`Buy ${name} for ${price} Pi`}
      >
        Buy
      </button>
    </div>
  );
}
