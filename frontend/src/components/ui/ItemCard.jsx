import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

// External styles (recommended: add to ItemCard.module.css or similar)
import "./ItemCard.css";

function ItemCard({ item }) {
  const { name, iconUrl, rarity } = item;

  // Memoize drag configuration to avoid unnecessary recalculations
  const dragSpec = useMemo(
    () => ({
      type: "ITEM",
      item: { ...item },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item],
  );

  const [{ isDragging }, dragRef] = useDrag(dragSpec);

  return (
    <div
      ref={dragRef}
      className={`item-card rarity-${rarity.toLowerCase()}${isDragging ? " dragging" : ""}`}
      aria-label={`Draggable item: ${name}, Rarity: ${rarity}`}
      tabIndex={0}
      role="listitem"
    >
      <img
        className="item-card__icon"
        src={iconUrl}
        alt={name}
        loading="lazy"
        draggable={false}
      />
      <div className="item-card__name">{name}</div>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    iconUrl: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(ItemCard);
