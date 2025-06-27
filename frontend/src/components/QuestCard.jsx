import React from "react";

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
        <span className="quest-status">{quest.status.replace("_", " ")}</span>
      </div>
      <p className="quest-description">{quest.description}</p>

      <div className="quest-rewards">
        {quest.reward_xp > 0 && <span>⭐ {quest.reward_xp} XP</span>}
        {quest.reward_coins > 0 && <span>🪙 {quest.reward_coins} Pi</span>}
        {quest.reward_item && <span>🎁 {quest.reward_item}</span>}
      </div>

      <div className="quest-actions">
        {quest.status === "available" && (
          <button className="quest-button" onClick={handleStart}>
            Accept
          </button>
        )}
        {quest.status === "in_progress" && (
          <button className="quest-button" onClick={handleComplete}>
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
