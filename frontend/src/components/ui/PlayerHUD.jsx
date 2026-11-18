import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPlayerStats } from '../../hooks/usePlayerStats';
import EquipmentPanel from './EquipmentPanel';
import Hotbar from './Hotbar';

export default function PlayerHUD({ userId, inventory }) {
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchPlayerStats(userId).then((data) => {
      if (data) setStats(data);
      else setFailed(true);
    });
  }, [userId]);

  if (failed) {
    return (
      <div className="player-hud-container">
        <p className="text-sm text-gray-400">
          Player stats need Supabase — connect it to show HP, mana, and XP.
        </p>
      </div>
    );
  }

  if (!stats) return <div>Loading player stats...</div>;

  return (
    <div className="player-hud-container">
      <div className="equipment-section">
        <h2>Equipment</h2>
        <EquipmentPanel userId={userId} />
      </div>

      <div className="stats-section">
        <h2>Player Stats</h2>
        <div className="stat-row">❤️ HP: {stats.hp} / {stats.max_hp}</div>
        <div className="stat-row">🔮 Mana: {stats.mana} / {stats.max_mana}</div>
        <div className="stat-row">⭐ XP: {stats.xp}</div>
        <div className="stat-row">📈 Level: {stats.level}</div>
      </div>

      <div className="hotbar-section">
        <h2>Hotbar</h2>
        <Hotbar userId={userId} inventory={inventory} />
      </div>
    </div>
  );
}

PlayerHUD.propTypes = {
  userId: PropTypes.string,
  inventory: PropTypes.arrayOf(PropTypes.object),
};

PlayerHUD.defaultProps = {
  userId: null,
  inventory: [],
};
