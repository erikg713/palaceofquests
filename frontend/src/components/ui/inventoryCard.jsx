function ItemCard({ item, onClick }) {
  return (
    <div className={`item-card rarity-${item.rarity.toLowerCase()}`} onClick={() => onClick(item)}>
      <img src={item.iconUrl} alt={item.name} />
      <div className="item-stars">
        {'★'.repeat(item.stars)}
      </div>
      <div className="item-name">{item.name}</div>
    </div>
  )
}
function ItemCard({ item, onClick }) {
  return (
    <div className={`item-card rarity-${item.rarity.toLowerCase()}`} onClick={() => onClick(item)}>
      <img src={item.iconUrl} alt={item.name} />
      <div className="item-stars">
        {'★'.repeat(item.stars)}
      </div>
      <div className="item-name">{item.name}</div>
    </div>
  )
}