import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

const RARITY_STYLES = {
  common: 'border-gray-500',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-gold',
};

const MarketplaceItem = ({ item, onBuy }) => {
  const { name, type, price, rarity, icon } = item;

  const handleBuy = useCallback(() => {
    onBuy?.(item);
  }, [onBuy, item]);

  return (
    <div
      className={`bg-gray-800 p-4 rounded-xl border-2 ${RARITY_STYLES[rarity] || RARITY_STYLES.common} hover:scale-[1.02] transition-transform`}
      tabIndex={0}
      aria-label={`Marketplace Item: ${name}, ${type}, ${price} Pi, rarity ${rarity}`}
    >
      <div className="text-4xl mb-2" aria-hidden="true">
        {icon || '📦'}
      </div>
      <div className="font-bold text-white" title={name}>
        {name}
      </div>
      <div className="text-sm text-gray-400 capitalize">
        {type} · {rarity}
      </div>
      <div className="text-gold font-semibold mt-1">💰 {price} Pi</div>
      <button
        type="button"
        className="quest-button mt-3 w-full"
        onClick={handleBuy}
        aria-label={`Buy ${name} for ${price} Pi`}
      >
        Buy
      </button>
    </div>
  );
};

MarketplaceItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rarity: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  onBuy: PropTypes.func,
};

MarketplaceItem.defaultProps = {
  onBuy: undefined,
};

export default memo(MarketplaceItem);
