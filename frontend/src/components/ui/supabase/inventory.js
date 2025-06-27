import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../supabaseClient"; // Adjust path as needed
import PropTypes from "prop-types";

// InventoryItem subcomponent for clarity and modularity
function InventoryItem({ item, onRemove }) {
  return (
    <div className="inventory-item">
      <span>{item.name}</span>
      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        Remove
      </button>
    </div>
  );
}

InventoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("User not authenticated");
      setInventory([]);
      setLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    setInventory(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newItem.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("User not authenticated");
      return;
    }
    const { error: insertError } = await supabase
      .from("inventory")
      .insert([{ name: newItem.trim(), user_id: user.id }]);
    if (insertError) {
      setError(insertError.message);
    } else {
      setNewItem("");
      fetchInventory();
    }
  };

  const handleRemoveItem = async (id) => {
    setError(null);
    const { error: deleteError } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <section className="inventory">
      <h2>Inventory</h2>
      <form onSubmit={handleAddItem} className="inventory-form">
        <input
          type="text"
          placeholder="Add new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          aria-label="Add new inventory item"
        />
        <button type="submit">Add</button>
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="inventory-list">
          {inventory.length === 0 ? (
            <div>No items in inventory.</div>
          ) : (
            inventory.map((item) => (
              <InventoryItem
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}
