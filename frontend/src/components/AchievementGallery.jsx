import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { allAchievements } from '../data/achievements';

export default function AchievementGallery({ userId }) {
  const [earnedIds, setEarnedIds] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetchAchievements = async () => {
      const { data } = await supabase
        .from('achievements')
        .select('achievement_id')
        .eq('user_id', userId);
      setEarnedIds(data.map((row) => row.achievement_id));
    };
    fetchAchievements();
  }, [userId]);

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">🏆 Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allAchievements.map((a) => {
          const earned = earnedIds.includes(a.id);
          return (
            <div
              key={a.id}
              className={`p-3 rounded-lg text-center border ${
                earned ? 'border-green-500' : 'border-gray-700 opacity-50'
              }`}
            >
              <img src={a.icon} alt={a.name} className="mx-auto w-16 h-16 mb-2" />
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-gray-400">{a.description}</p>
              {earned && <p className="text-green-400 text-xs mt-1">Unlocked</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}