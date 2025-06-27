// src/components/QuestLog.jsx
import { useEffect, useState } from "react";
import { rewardUser } from "../api/paymentService"; // existing A2U integration

export default function QuestLog({ uid }) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sample hardcoded quests; later load from backend or Firestore
    setQuests([
      { id: "dragon01", name: "Defeat the Dragon", reward: 1 },
      { id: "maze02", name: "Escape the Maze", reward: 0.5 },
    ]);
  }, []);

  const handleReward = async (quest) => {
    setLoading(quest.id);
    await rewardUser(uid, quest.id, quest.reward);
    setQuests((prev) =>
      prev.map((q) => (q.id === quest.id ? { ...q, completed: true } : q)),
    );
    setLoading(null);
  };

  return (
    <div>
      <h2>Quests</h2>
      <ul>
        {quests.map((q) => (
          <li key={q.id}>
            {q.name} — Reward: {q.reward} Pi
            {q.completed ? (
              <span> ✅ Completed</span>
            ) : (
              <button disabled={loading} onClick={() => handleReward(q)}>
                {loading === q.id ? "Rewarding..." : "Complete Quest"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
