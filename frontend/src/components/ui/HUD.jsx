import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const HUD = memo(({ username, xp, coins }) => (
  <div className="bg-gray-800 text-white p-4 rounded shadow space-y-2">
    <p><strong>{username}</strong></p>
    <p>XP: {xp}</p>
    <p>💰 Pi: {coins}</p>
    <Button>Enter Realm</Button>
  </div>
));

HUD.propTypes = {
  username: PropTypes.string.isRequired,
  xp: PropTypes.number.isRequired,
  coins: PropTypes.number.isRequired,
};

export default HUD;
