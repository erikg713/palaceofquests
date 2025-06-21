import { useEffect, useState, useCallback } from 'react';

// Example API call function (replace with your actual API logic)
async function fetchInventory(userId) {
  // Replace with your real API endpoint and fetch logic
  const response = await fetch(`/api/players/${userId}/inventory`);
  if (!response.ok) throw new Error('Failed to fetch inventory.');
  return response.json();
}

// Example API call to update inventory (add/remove items)
async function updateInventory(userId, items) {
  // Replace with your real API endpoint and fetch logic
  const response = await fetch(`/api/players/${userId}/inventory`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error('Failed to update inventory.');
  return response.json();
}

export default function useInventory(userId) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory on mount & when userId changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchInventory(userId)
      .then(data => {
        if (isMounted) {
          setInventory(data.items || []);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message || 'Failed to load inventory.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [userId]);

  // Add item to inventory
  const addItem = useCallback(async (item) => {
    const updated = [...inventory, item];
    setInventory(updated); // Optimistic update
    try {
      await updateInventory(userId, updated);
    } catch (err) {
      setError(err.message || 'Failed to add item.');
      setInventory(inventory); // Revert on error
    }
  }, [userId, inventory]);

  // Remove item from inventory
  const removeItem = useCallback(async (itemId) => {
    const updated = inventory.filter(item => item.id !== itemId);
    setInventory(updated); // Optimistic update
    try {
      await updateInventory(userId, updated);
    } catch (err) {
      setError(err.message || 'Failed to remove item.');
      setInventory(inventory); // Revert on error
    }
  }, [userId, inventory]);

  // Expose inventory, loading, error, and mutators
  return {
    inventory,
    loading,
    error,
    addItem,
    removeItem,
    refresh: async () => {
      setLoading(true);
      try {
        const data = await fetchInventory(userId);
        setInventory(data.items || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to refresh inventory.');
      } finally {
        setLoading(false);
      }
    }
  };
}
