import EquipmentPanel from './EquipmentPanel';
import Hotbar from './Hotbar';

export default function PlayerHUD({ userId, inventory }) {
  return (
    <div className="player-hud-container">
      <div className="equipment-section">
        <h2>Equipment</h2>
        <EquipmentPanel userId={userId} />
      </div>

      <div className="stats-section">
        <h2>Player Stats</h2>
        <div className="stat-row"><strong>HP:</strong> 140/200</div>
        <div className="stat-row"><strong>Mana:</strong> 85/100</div>
        <div className="stat-row"><strong>XP:</strong> 620/1000</div>
        {/* Add buffs, level, etc. here */}
      </div>

      <div className="hotbar-section">
        <h2>Hotbar</h2>
        <Hotbar userId={userId} inventory={inventory} />
      </div>
    </div>
  );
}