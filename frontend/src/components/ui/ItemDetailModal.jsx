import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./styles/ui.css";

const ItemDetailModal = ({ item, onClose }) => {
  // Ensure modal closes on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!item) return null;

  const handleUse = () => {
    // Placeholder: replace with logic as needed
    window.alert(`Used ${item.name}`);
  };

  const handleSell = () => {
    // Placeholder: replace with logic as needed
    window.alert(`Sell ${item.name} for ${item.sellValue ?? 0} Pi`);
  };

  return (
    <div className="modal-backdrop" role="presentation" tabIndex={-1}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        aria-describedby="item-modal-desc"
      >
        <h3 id="item-modal-title">{item.name}</h3>
        <p>
          <strong>Type:</strong> {item.type || "Unknown"}
        </p>
        <p>
          <strong>Rarity:</strong> {item.rarity || "Common"}
        </p>
        <p id="item-modal-desc">
          <strong>Description:</strong> {item.description || "No description."}
        </p>
        <div className="modal-actions">
          <button type="button" onClick={handleUse}>
            Use
          </button>
          <button type="button" onClick={handleSell}>
            Sell
          </button>
          <button type="button" onClick={onClose} className="close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ItemDetailModal.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    rarity: PropTypes.string,
    description: PropTypes.string,
    sellValue: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

export default React.memo(ItemDetailModal);
