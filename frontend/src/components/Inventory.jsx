import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "../lib/supabaseClient";

export default function Inventory({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("inventory")
          .select("*")
          .eq("user_id", userId)
          .order("obtained_at", { ascending: false });

        if (error) throw error;

        setItems(data || []);
      } catch (err) {
        setError("Failed to fetch inventory. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userId]);

  return (
    <div className="inventory-container p-4 bg-gray-900 rounded-2xl shadow-lg text-white">
      <h2 className="inventory-title text-2xl font-bold mb-4">🎒 Inventory</h2>
      {loading ? (
        <p>Loading your inventory...</p>
      ) : error ? (
        <p className="error-message text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <p>No items found. Complete a quest to earn loot!</p>
      ) : (
        <div className="inventory-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="inventory-item bg-gray-800 p-3 rounded-xl border border-purple-500 hover:scale-105 transition-transform"
            >
              <h3 className="item-name text-lg font-semibold">
                {item.item_name}
              </h3>
              <p className="item-realm text-sm text-purple-300">
                Realm: {item.realm_id}
              </p>
              <p className="item-date text-sm text-gray-400">
                Looted: {new Date(item.obtained_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Inventory.propTypes = {
  userId: PropTypes.string.isRequired,
};
