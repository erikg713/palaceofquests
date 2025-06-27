import React, { useContext, useMemo, Suspense, lazy } from "react";
import { PiWalletContext } from "../context/PiWalletContext";
import useInventory from "../hooks/useInventory";
import InventorySkeleton from "../components/InventorySkeleton";
import InventoryErrorBoundary from "../components/InventoryErrorBoundary";

const InventoryList = lazy(() => import("../components/InventoryList"));

const InventoryPage = () => {
  const { piUser } = useContext(PiWalletContext);
  const userId = useMemo(() => piUser?.uid ?? null, [piUser]);
  const { inventory, loading, error } = useInventory(userId);

  return (
    <main
      className="max-w-2xl mx-auto p-6 text-white"
      aria-labelledby="inventory-heading"
    >
      <header>
        <h1
          id="inventory-heading"
          className="text-3xl font-bold mb-6"
          tabIndex={0}
          aria-label="Your Inventory"
        >
          🎒 Your Inventory
        </h1>
      </header>
      <InventoryErrorBoundary>
        <Suspense fallback={<InventorySkeleton />}>
          <InventoryList
            inventory={inventory}
            loading={loading}
            error={error}
          />
        </Suspense>
      </InventoryErrorBoundary>
    </main>
  );
};

export default InventoryPage;
