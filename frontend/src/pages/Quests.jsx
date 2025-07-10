import React, { useEffect, useState } from 'react';
import QuestCard from '../components/QuestCard';
import { supabase } from '../api/supabaseClient';
import QuestList from '../components/quest/QuestList';

export default function Quests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/quests')
      .then(res => res.json())
      .then(setQuests);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Available Quests</h1>
      <QuestList quests={quests} />
    </div>
  );
}

export default function Quests({ userId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayerQuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('player_quests')
      .select('*, quests(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching quests:', error);
    } else {
      const formatted = data.map(row => ({
        ...row.quests,
        ...row,
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
    fetchPlayerQuests();
  };
}
