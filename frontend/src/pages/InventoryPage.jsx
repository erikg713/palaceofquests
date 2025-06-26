// frontend/src/pages/InventoryPage.jsx

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { PiWalletContext } from "../../context/PiWalletContext";
import useInventory from "../../hooks/useInventory";
import InventoryList from "../components/InventoryList";

const InventoryPage = () => {
  const { piUser } = useContext(PiWalletContext);
  const userId = piUser?.uid;
  const { inventory, loading, error } = useInventory(userId);

  return (
    <section
      className="max-w-2xl mx-auto p-6 text-white"
      aria-labelledby="inventory-heading"
    >
      <h1 id="inventory-heading" className="text-3xl font-bold mb-6" tabIndex={0}>
        🎒 Your Inventory
      </h1>
      <InventoryList inventory={inventory} loading={loading} error={error} />
    </section>
  );
};

export default InventoryPage;
