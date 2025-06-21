import React, { useRef, useState } from "react";

interface DragAndDropProps<T> {
  items: T[];
  renderItem: (item: T, isDragging: boolean) => React.ReactNode;
  onChange: (items: T[]) => void;
  className?: string;
}

function DragAndDrop<T>({
  items,
  renderItem,
  onChange,
  className = "",
}: DragAndDropProps<T>) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const draggingRef = useRef<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
    draggingRef.current = idx;
  };

  const handleDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    setHoveredIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (
      draggedIdx !== null &&
      draggedIdx !== idx &&
      draggedIdx >= 0 &&
      idx >= 0
    ) {
      const updated = [...items];
      const [removed] = updated.splice(draggedIdx, 1);
      updated.splice(idx, 0, removed);
      onChange(updated);
    }
    setHoveredIdx(null);
    setDraggedIdx(null);
    draggingRef.current = null;
  };

  const handleDragEnd = () => {
    setHoveredIdx(null);
    setDraggedIdx(null);
    draggingRef.current = null;
  };

  return (
    <div className={className}>
      {items.map((item, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(idx, e)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={handleDragEnd}
          style={{
            opacity: draggedIdx === idx ? 0.5 : 1,
            border:
              hoveredIdx === idx && draggedIdx !== null
                ? "2px dashed #0070f3"
                : "1px solid transparent",
            borderRadius: 6,
            marginBottom: 8,
            background: "#fff",
            cursor: "grab",
            transition: "border 0.2s, opacity 0.2s",
            userSelect: "none",
          }}
        >
          {renderItem(item, draggedIdx === idx)}
        </div>
      ))}
    </div>
  );
}

export default DragAndDrop;
