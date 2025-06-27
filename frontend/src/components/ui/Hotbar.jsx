import { useEffect, useState } from "react";
import HotbarSlot from "./HotbarSlot";
import { fetchHotbar, updateHotbarSlot } from "../hooks/useHotbar";

export default function Hotbar({ userId, inventory }) {
  const [slots, setSlots] = useState(Array(6).fill(null));

  useEffect(() => {
    fetchHotbar(userId).then((data) => {
      const newSlots = [...slots];
      data.forEach((entry) => {
        const item = inventory.find((i) => i.id === entry.item_id);
        if (item) newSlots[entry.slot_index] = item;
      });
      setSlots(newSlots);
    });
  }, [userId, inventory]);

  const handleDrop = async (slotIndex, item) => {
    await updateHotbarSlot(userId, slotIndex, item.id);
    const updatedSlots = [...slots];
    updatedSlots[slotIndex] = item;
    setSlots(updatedSlots);
  };

  return (
    <div className="hotbar">
      {slots.map((item, index) => (
        <HotbarSlot
          key={index}
          index={index}
          item={item}
          onDrop={handleDrop}
          userId={userId}
        />
      ))}
    </div>
  );
}
