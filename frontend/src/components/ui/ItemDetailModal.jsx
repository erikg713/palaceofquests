import React from 'react'
import './styles/ui.css'

export default function ItemDetailModal({ item, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{item.name}</h3>
        <p><strong>Type:</strong> {item.type || 'Unknown'}</p>
        <p><strong>Rarity:</strong> {item.rarity || 'Common'}</p>
        <p><strong>Description:</strong> {item.description || 'No description.'}</p>

        <div className="modal-actions">
          <button onClick={() => alert(`Used ${item.name}`)}>Use</button>
          <button onClick={() => alert(`Sell ${item.name} for ${item.sellValue || 0} Pi`)}>Sell</button>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  )
}