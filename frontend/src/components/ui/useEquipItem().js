import { useState, useCallback } from "react";

/**
 * useEquipItem - A custom React hook for equipping player avatars with items.
 * @param {Object} initialEquipment - The initial state of equipped items (optional).
 * @returns {Object} - { equipment, equipItem, unequipItem, isEquipped }
 */
const useEquipItem = (initialEquipment = {}) => {
  const [equipment, setEquipment] = useState(initialEquipment);

  // Equip an item to a specific slot (e.g., 'head', 'body', 'weapon')
  const equipItem = useCallback((slot, item) => {
    setEquipment((prev) => ({
      ...prev,
      [slot]: item,
    }));
  }, []);

  // Remove an item from a specific slot
  const unequipItem = useCallback((slot) => {
    setEquipment((prev) => {
      const updated = { ...prev };
      delete updated[slot];
      return updated;
    });
  }, []);

  // Check if a specific item is equipped in a slot
  const isEquipped = useCallback(
    (slot, itemId) => {
      return equipment[slot]?.id === itemId;
    },
    [equipment],
  );

  return {
    equipment,
    equipItem,
    unequipItem,
    isEquipped,
  };
};

export default useEquipItem;
