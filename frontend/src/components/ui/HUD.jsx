import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from './Button'; // Make sure this path is correct
import './styles/ui.css';

const HUD = memo(function HUD({ username, xp, coins }) {
  return (
    <div className="hud-panel" role="contentinfo" aria-label="User HUD">
      <p><strong>{username}</strong></p>
      <p>Experience Points: {xp}</p>
      <p>💰 Pi: {coins}</p>
      <Button variant="default">Enter Realm</Button>
    </div>
  );
});

HUD.propTypes = {
  username: PropTypes.string.isRequired,
  xp: PropTypes.number.isRequired,
  coins: PropTypes.number.isRequired,
};

export default HUD;
