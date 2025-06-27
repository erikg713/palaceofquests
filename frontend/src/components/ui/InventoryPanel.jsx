import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ItemDetailModal from "./ItemDetailModal";
import "./styles/ui.css";

export default function InventoryPanel({ inventory }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!Array.isArray(inventory)) {
    return <div className="inventory-panel">No items in inventory.</div>;
  }

  if (inventory.length === 0) {
    return <div className="inventory-panel">Your inventory is empty.</div>;
  }

  const renderedItems = useMemo(() => {
    return inventory.map((item, i) => (
      <li
        key={i}
        onClick={() => setSelectedItem(item)}
        onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
        className="inventory-item"
        role="button"
        tabIndex="0"
        aria-label={`View details for ${item.name}`}
      >
        {item.name} ×{item.qty}
      </li>
    ));
  }, [inventory]);

  return (
    <div className="inventory-panel">
      <h4>🎒 Inventory</h4>
      <ul>{renderedItems}</ul>
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

InventoryPanel.propTypes = {
  inventory: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      qty: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
