import { useDrop } from 'react-dnd';

export default function EquipmentSlot({ slotType, equippedItem, onEquip }) {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item) => {
      if (item.type === slotType) onEquip(item);
    },
    canDrop: (item) => item.type === slotType,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [equippedItem]);

  return (
    <div ref={dropRef} className={`equip-slot ${slotType} ${isOver && canDrop ? 'highlight' : ''}`}>
      {equippedItem ? (
        <img src={equippedItem.iconUrl} alt={equippedItem.name} />
      ) : (
        <span>{slotType}</span>
      )}
    </div>
  );
}