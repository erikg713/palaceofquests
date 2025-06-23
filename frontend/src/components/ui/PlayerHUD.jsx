import EquipmentPanel from './EquipmentPanel';
import Hotbar from './Hotbar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function PlayerHUD({ userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) console.error('Profile error:', error);
      else setProfile(data);
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return null;

  const xpPercent = (profile.xp / 100) * 100;

  return (
    <div className="fixed top-4 left-4 bg-gray-900 p-4 rounded-xl border border-purple-700 shadow-lg w-64 z-50 text-white">
      <h2 className="text-lg font-bold">{profile.username}</h2>
      <p className="text-sm text-gray-300">Level {profile.level}</p>

      <div className="mt-2 h-4 w-full bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 transition-all"
          style={{ width: `${xpPercent}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 mt-1">{profile.xp}/100 XP</p>
    </div>
  );
}
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
import { useEffect, useState } from 'react';
import { fetchPlayerStats } from '../hooks/usePlayerStats';
import EquipmentPanel from './EquipmentPanel';
import Hotbar from './Hotbar';

export default function PlayerHUD({ userId, inventory }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPlayerStats(userId).then(setStats);
  }, [userId]);

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
