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
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './styles/ui.css';

const HUD = memo(function HUD({ username, xp, coins }) {
  return (
    <div className="hud-panel" role="contentinfo" aria-label="User HUD">
      <p><strong>{username}</strong></p>
      <p>Experience Points: {xp}</p>
      <p>💰 Coins: {coins}</p>
    </div>
  );
});

HUD.propTypes = {
  username: PropTypes.string.isRequired,
  xp: PropTypes.number.isRequired,
  coins: PropTypes.number.isRequired,
};

export default HUD;
