import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./MarketplaceItem.module.css";

const MarketplaceItem = ({ item, onBuy }) => {
  const { name, type, price, rarity, iconUrl } = item;

  const handleBuy = useCallback(() => {
    onBuy?.(item);
  }, [onBuy, item]);

  return (
    <div
      className={`${styles.marketItem} ${styles[`rarity${rarity}`]}`}
      tabIndex={0}
      aria-label={`Marketplace Item: ${name}, ${type}, ${price} Pi, rarity ${rarity}`}
    >
      <img
        src={iconUrl}
        alt={name}
        className={styles.itemImg}
        loading="lazy"
        draggable={false}
      />
      <div className={styles.itemInfo}>
        <div className={styles.itemName} title={name}>
          {name}
        </div>
        <div className={styles.itemType}>{type}</div>
        <div className={styles.itemPrice}>
          <span role="img" aria-label="currency">
            💰
          </span>{" "}
          {price} Pi
        </div>
      </div>
      <button
        type="button"
        className={styles.buyButton}
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
    iconUrl: PropTypes.string.isRequired,
  }).isRequired,
  onBuy: PropTypes.func,
};

MarketplaceItem.defaultProps = {
  onBuy: undefined,
};

export default memo(MarketplaceItem);
