import React from 'react';
import './QuestHUD.css';

export default function QuestHUD({ quests, onSelect }) {
  const activeQuests = quests.slice(0, 8); // Show up to 8 in HUD

  return (
    <div className="quest-hud">
      <div className="circle">
        {activeQuests.map((q, i) => {
          const angle = (360 / activeQuests.length) * i;
          const transform = `rotate(${angle}deg) translate(6rem) rotate(-${angle}deg)`;
          return (
            <div
              key={q.quest_id}
              className={`quest-icon status-${q.status}`}
              style={{ transform }}
              onClick={() => onSelect(q)}
              title={q.title}
            >
              🧭
            </div>
          );
        })}
      </div>
    </div>
  );
}
