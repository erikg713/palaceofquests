import { useDrop } from "react-dnd";
import { useItem } from "../hooks/inventoryActions";

export default function HotbarSlot({ index, item, onDrop, userId }) {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "ITEM",
      drop: (draggedItem) => onDrop(index, draggedItem),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [item],
  );

  const handleUse = () => {
    if (item) useItem(item, userId); // hook already connected to Supabase
  };

  return (
    <div
      ref={dropRef}
      className={`hotbar-slot ${isOver ? "hover" : ""}`}
      onClick={handleUse}
    >
      {item ? (
        <img src={item.iconUrl} alt={item.name} />
      ) : (
        <span>{index + 1}</span>
      )}
    </div>
  );
}
