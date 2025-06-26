import React, { useState } from "react";
import PropTypes from "prop-types";
import useInventory from "../hooks/useInventory";
import { supabase } from "../lib/supabaseClient";

// Modal overlay & content styling can be adapted to your design system
const InventoryModal = ({ userId, open, onClose }) => {
  const { inventory, loading, error, refresh } = useInventory(userId);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [selected, setSelected] = useState(null);

  // Example: Use Item (adjust DB logic to your needs)
  const handleUse = async (invId) => {
    setActionLoading(true);
    setActionError("");
    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", invId)
        .single();
      if (error) throw error;
      refresh();
      setSelected(null);
    } catch (err) {
      setActionError("Failed to use item.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <button
            className="text-gray-400 hover:text-white"
            aria-label="Close"
            onClick={onClose}
            disabled={actionLoading}
          >
            ×
          </button>
        </header>

        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : inventory.length === 0 ? (
          <div className="text-gray-400">No items in your inventory.</div>
        ) : (
          <ul className="space-y-2">
            {inventory.map((item) => (
              <li
                key={item.invId}
                className={`p-3 rounded flex justify-between items-center ${
                  selected === item.invId ? "bg-gray-700" : "bg-gray-800"
                }`}
              >
                <div>
                  <strong>{item.item_name}</strong>
                  {item.qty > 1 && (
                    <span className="ml-2 text-sm text-blue-300">×{item.qty}</span>
                  )}
                  {item.description && (
                    <div className="text-xs text-gray-400">{item.description}</div>
                  )}
                </div>
                <div className="space-x-1">
                  <button
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    onClick={() => setSelected(item.invId)}
                    disabled={actionLoading}
                  >
                    Action
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Action Modal */}
        {selected && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
            <div className="bg-white text-gray-900 rounded p-6 shadow-lg max-w-xs w-full">
              <h3 className="text-lg font-semibold mb-2">Use this item?</h3>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => setSelected(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={() => handleUse(selected)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Use"}
                </button>
              </div>
              {actionError && <div className="text-xs text-red-500 mt-2">{actionError}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

InventoryModal.propTypes = {
  userId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InventoryModal;
