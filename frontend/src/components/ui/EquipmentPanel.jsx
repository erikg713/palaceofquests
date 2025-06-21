import EquipmentSlot from './EquipmentSlot';
import { useState } from 'react';
import { equipItem } from '../hooks/equipmentActions'; // Supabase hook

export default function EquipmentPanel({ userId }) {
  const [slots, setSlots] = useState({
    weapon: null,
    armor: null,
    trinket: null
  });

  const handleEquip = async (item) => {
    await equipItem(userId, item);
    setSlots((prev) => ({ ...prev, [item.type]: item }));
  };

  return (
    <div className="equipment-panel">
      <EquipmentSlot slotType="weapon" equippedItem={slots.weapon} onEquip={handleEquip} />
      <EquipmentSlot slotType="armor" equippedItem={slots.armor} onEquip={handleEquip} />
      <EquipmentSlot slotType="trinket" equippedItem={slots.trinket} onEquip={handleEquip} />
    </div>
  );
}