import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabaseClient';

function QuestList({ title, quests, emptyMessage, accentColor }) {
  return (
    <section className="mb-6">
      <h3 className={`text-xl font-semibold mb-2 ${accentColor}`}>{title}</h3>
      {quests.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {quests.map((q) => (
            <li key={q.id} className="bg-gray-800 rounded p-3">
              <p className="font-semibold">{q.quest_name}</p>
              <p className="text-sm text-gray-400">
                Realm: {q.realm_id} — XP: {q.xp_earned}
                {q.completed_at && (
                  <>
                    <br />
                    Done: {new Date(q.completed_at).toLocaleDateString()}
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

QuestList.propTypes = {
  title: PropTypes.string.isRequired,
  quests: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string.isRequired,
  accentColor: PropTypes.string.isRequired,
};

export default function QuestTracker({ userId }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (!userId) return;

    const fetchQuests = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (error) throw error;
        if (isMounted) setQuests(data || []);
      } catch (err) {
        if (isMounted) setErrorMsg('Failed to load quests. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuests();

    return () => { isMounted = false; };
  }, [userId]);

  const activeQuests = quests.filter(q => !q.completed_at);
  const completedQuests = quests.filter(q => q.completed_at);

  return (
    <div className="text-white p-6 bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">🧾 Quest Tracker</h2>
      {loading ? (
        <p className="text-white" aria-live="polite">Loading quests...</p>
      ) : errorMsg ? (
        <div className="mb-4 text-red-400">{errorMsg}</div>
      ) : (
        <>
          <QuestList
            title="Active Quests"
            quests={activeQuests}
            emptyMessage="No active quests. Accept one from an NPC!"
            accentColor="text-yellow-400"
          />
          <QuestList
            title="Completed Quests"
            quests={completedQuests}
            emptyMessage="You haven’t completed any quests yet."
            accentColor="text-green-400"
          />
        </>
      )}
    </div>
  );
}

QuestTracker.propTypes = {
  userId: PropTypes.string.isRequired,
};
}
