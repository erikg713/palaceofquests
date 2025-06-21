import React from 'react'
import './styles/ui.css'

export default function HUD({ username, xp, coins }) {
  return (
    <div className="hud-panel">
      <p><strong>{username}</strong></p>
      <p>XP: {xp}</p>
      <p>💰 Pi: {coins}</p>
    </div>
  )
}