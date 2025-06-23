import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, level, xp, pi_spent')
        .order('xp', { ascending: false })
        .limit(25);

      if (data) setPlayers(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🏛️ Leaderboard</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-400">
            <th className="pb-2">#</th>
            <th className="pb-2">Player</th>
            <th className="pb-2">Lvl</th>
            <th className="pb-2">XP</th>
            <th className="pb-2">Pi Spent</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.username} className="border-t border-gray-700 text-sm">
              <td className="py-2">{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.level}</td>
              <td>{player.xp}</td>
              <td>{player.pi_spent ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}