import React from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import clsx from "clsx";

export default function EquipmentSlot({ slotType, equippedItem, onEquip }) {
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: "ITEM",
      drop: (item) => {
        if (item.type === slotType) onEquip(item);
      },
      canDrop: (item) => item.type === slotType,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [equippedItem],
  );

  return (
    <div
      ref={dropRef}
      className={clsx("equip-slot", slotType, {
        highlight: isOver && canDrop,
      })}
      role="button"
      aria-label={`Equipment slot for ${slotType}`}
      aria-dropeffect="move"
    >
      {equippedItem ? (
        <img
          src={equippedItem.iconUrl || "/default-icon.png"}
          alt={equippedItem.name || "Equipped item"}
          loading="lazy"
        />
      ) : (
        <span>{slotType}</span>
      )}
    </div>
  );
}

EquipmentSlot.propTypes = {
  slotType: PropTypes.string.isRequired,
  equippedItem: PropTypes.shape({
    iconUrl: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  onEquip: PropTypes.func.isRequired,
};

EquipmentSlot.defaultProps = {
  equippedItem: null,
};
