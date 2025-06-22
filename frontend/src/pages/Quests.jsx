import React, { useEffect, useState } from 'react';
import QuestCard from '../components/QuestCard';
import { supabase } from '../api/supabaseClient';

export default function Quests({ userId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quests for this user
  const fetchPlayerQuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('player_quests')
      .select('*, quests(*)') // Includes quest title/description via FK
      .eq('user_id', userId);

    if (error) {
      console.error('Fetch quests error:', error);
    } else {
      const formatted = data.map((row) => ({
        ...row.quests,
        ...row, // include status, timestamps
      }));
      setQuests(formatted);
    }
    setLoading(false);
  };

  const startQuest = async (questId) => {
    await supabase
      .from('player_quests')
      .update({ status: 'in_progress', started_at: new Date() })
      .eq('user_id', userId)
      .eq('quest_id', questId);
    fetchPlayerQuests();
  };

  const completeQuest = async (questId) => {
    await supabase
      .from('player_quests')
      .update({ status: 'completed', completed_at: new Date() })
      .eq('user_id', userId)
      .eq('quest_id', questId);

    // Optionally: add XP & coins to player_stats here
    fetchPlayerQuests();
  };

  useEffect(() => {
    if (userId) fetchPlayerQuests();
  }, [userId]);

  if (loading) return <p>Loading quests...</p>;

  return (
    <div className="quests-page">
      <h2>Your Quests</h2>
      {quests.length === 0 ? (
        <p>No quests found for this player.</p>
      ) : (
        quests.map((quest) => (
          <QuestCard
            key={quest.quest_id}
            quest={quest}
            onStart={() => startQuest(quest.quest_id)}
            onComplete={() => completeQuest(quest.quest_id)}
          />
        ))
      )}
    </div>
  );
}
