import { useDrag } from 'react-dnd';

export default function ItemCard({ item }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'ITEM',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div ref={dragRef} className={`item-card rarity-${item.rarity.toLowerCase()}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={item.iconUrl} alt={item.name} />
      <div>{item.name}</div>
    </div>
  );
}