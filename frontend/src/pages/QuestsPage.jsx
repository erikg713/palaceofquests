import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import QuestTracker from '../components/QuestTracker';

export default function QuestsPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎯 My Quests</h1>
      <QuestTracker userId={userId} />
    </div>
  );
}