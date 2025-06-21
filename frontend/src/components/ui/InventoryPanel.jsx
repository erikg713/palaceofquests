import React, { useState } from 'react'
import ItemDetailModal from './ItemDetailModal'
import './styles/ui.css'

export default function InventoryPanel({ inventory }) {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <div className="inventory-panel">
      <h4>🎒 Inventory</h4>
      <ul>
        {inventory.map((item, i) => (
          <li key={i} onClick={() => setSelectedItem(item)} className="inventory-item">
            {item.name} ×{item.qty}
          </li>
        ))}
      </ul>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}