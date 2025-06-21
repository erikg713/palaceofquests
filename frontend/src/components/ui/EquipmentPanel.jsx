import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import EquipmentSlot from './EquipmentSlot';
import { equipItem } from '../hooks/equipmentActions';

const SLOT_TYPES = ['weapon', 'armor', 'trinket'];

export default function EquipmentPanel({ userId }) {
  const [slots, setSlots] = useState(() =>
    SLOT_TYPES.reduce((acc, type) => ({ ...acc, [type]: null }), {})
  );

  const handleEquip = useCallback(
    async (item) => {
      try {
        await equipItem(userId, item);
        setSlots((prev) => ({
          ...prev,
          [item.type]: item,
        }));
      } catch (err) {
        // Optionally trigger a UI notification here
        // eslint-disable-next-line no-console
        console.error('Failed to equip item:', err);
      }
    },
    [userId]
  );

  return (
    <div className="equipment-panel">
      {SLOT_TYPES.map((type) => (
        <EquipmentSlot
          key={type}
          slotType={type}
          equippedItem={slots[type]}
          onEquip={handleEquip}
        />
      ))}
    </div>
  );
}

EquipmentPanel.propTypes = {
  userId: PropTypes.string.isRequired,
};
