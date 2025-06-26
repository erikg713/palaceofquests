// frontend/src/pages/InventoryPage.jsx

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { PiWalletContext } from "../../context/PiWalletContext";
import useInventory from "../../hooks/useInventory";

const InventoryList = ({ inventory, loading, error }) => {
  if (loading) return <div className="py-8 text-gray-400">Loading inventory...</div>;
  if (error) return <div className="py-8 text-red-400">Error: {error}</div>;
  if (!inventory.length) return <div className="py-8 text-gray-400">No items yet. Complete quests or visit the market!</div>;
// In your page or parent component
import React, { useState, useContext } from "react";
import InventoryModal from "../components/InventoryModal";
import { PiWalletContext } from "../context/PiWalletContext";

const InventoryPage = () => {
  const { piUser } = useContext(PiWalletContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        Open Inventory
      </button>
      <InventoryModal
        userId={piUser?.uid}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default InventoryPage;
  return (
    <ul className="space-y-2" aria-label="Inventory items">
      {inventory.map(item => (
        <li
          key={item.id}
          className="bg-gray-800 p-3 rounded shadow flex items-center justify-between"
          tabIndex={0}
        >
          <span>
            <strong>{item.item_name}</strong>
            {item.realm_id && (
              <span className="ml-2 text-xs text-gray-400">from <em>{item.realm_id}</em></span>
            )}
          </span>
          <span className="text-sm text-blue-300">x{item.qty}</span>
        </li>
      ))}
    </ul>
  );
};

InventoryList.propTypes = {
  inventory: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

const InventoryPage = () => {
  const { piUser } = useContext(PiWalletContext);
  const userId = piUser?.uid;
  const { inventory, loading, error } = useInventory(userId);

  return (
    <section className="max-w-2xl mx-auto p-6 text-white" aria-labelledby="inventory-heading">
      <h1 id="inventory-heading" className="text-3xl font-bold mb-6" tabIndex={0}>
        🎒 Your Inventory
      </h1>
      <InventoryList inventory={inventory} loading={loading} error={error} />
    </section>
  );
};

export default InventoryPage;
