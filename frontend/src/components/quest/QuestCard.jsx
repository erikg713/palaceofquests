import React from 'react';
import { Link } from 'react-router-dom';

export default function QuestCard({ quest }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl">{quest.title}</h2>
      <p>Reward: {quest.reward} Pi</p>
      <Link to={`/quests/${quest.id}`} className="text-blue-500">
        Details →
      </Link>
    </div>
  );
}
export default function QuestCard({ quest, onStart, onComplete }) {
  const handleStart = () => {
    if (onStart) onStart(quest);
  };

  const handleComplete = () => {
    if (onComplete) onComplete(quest);
  };

  return (
    <div className={`quest-card status-${quest.status}`}>
      <div className="quest-header">
        <h3>{quest.title}</h3>
        <span className="quest-status">{quest.status.replace('_', ' ')}</span>
      </div>
      <p className="quest-description">{quest.description}</p>

      <div className="quest-rewards">
        {quest.reward_xp > 0 && <span>⭐ {quest.reward_xp} XP</span>}
        {quest.reward_coins > 0 && <span>🪙 {quest.reward_coins} Pi</span>}
        {quest.reward_item && <span>🎁 {quest.reward_item}</span>}
      </div>

      <div className="quest-actions">
        {quest.status === 'available' && (
          <button className="quest-button" onClick={handleStart}>Accept</button>
        )}
        {quest.status === 'in_progress' && (
          <button className="quest-button" onClick={handleComplete}>Complete</button>
        )}
      </div>
    </div>
  );
}

