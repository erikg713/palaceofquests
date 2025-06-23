import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function QuestTracker({ userId }) {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const loadQuests = async () => {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) console.error('Quest error:', error);
      else setQuests(data);
    };
    loadQuests();
  }, [userId]);

  const activeQuests = quests.filter(q => !q.completed_at);
  const completedQuests = quests.filter(q => q.completed_at);

  return (
    <div className="text-white p-6 bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">🧾 Quest Tracker</h2>

      <div className="mb-6">
        <h3 className="text-xl text-yellow-400 font-semibold mb-2">Active Quests</h3>
        {activeQuests.length === 0 ? (
          <p className="text-sm text-gray-400">No active quests. Accept one from an NPC!</p>
        ) : (
          <ul className="space-y-2">
            {activeQuests.map((q) => (
              <li key={q.id} className="bg-gray-800 rounded p-3">
                <p className="font-semibold">{q.quest_name}</p>
                <p className="text-sm text-gray-400">Realm: {q.realm_id} — XP: {q.xp_earned}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-xl text-green-400 font-semibold mb-2">Completed Quests</h3>
        {completedQuests.length === 0 ? (
          <p className="text-sm text-gray-500">You haven’t completed any quests yet.</p>
        ) : (
          <ul className="space-y-2">
            {completedQuests.map((q) => (
              <li key={q.id} className="bg-gray-800 rounded p-3">
                <p className="font-semibold">{q.quest_name}</p>
                <p className="text-sm text-gray-400">
                  Realm: {q.realm_id} — XP: {q.xp_earned} <br />
                  Done: {new Date(q.completed_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}