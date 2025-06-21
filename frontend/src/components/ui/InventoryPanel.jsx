import React from 'react'
import './styles/ui.css'

export default function InventoryPanel({ inventory }) {
  return (
    <div className="inventory-panel">
      <h4>🎒 Inventory</h4>
      <ul>
        {inventory.map((item, i) => (
          <li key={i}>{item.name} ×{item.qty}</li>
        ))}
      </ul>
    </div>
  )
}r