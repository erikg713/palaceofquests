import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { inventoryData } from '../../data/items';

function itemName(itemId) {
  const all = Object.values(inventoryData).flat();
  return all.find((i) => i.id === itemId)?.name || itemId;
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
        <span className="quest-status">{String(quest.status).replace('_', ' ')}</span>
      </div>
      <p className="quest-description">{quest.description}</p>

      <div className="quest-rewards">
        {quest.reward_xp > 0 && <span>⭐ {quest.reward_xp} XP</span>}
        {quest.reward_coins > 0 && <span>🪙 {quest.reward_coins} Pi</span>}
        {quest.reward_item && <span>🎁 {itemName(quest.reward_item)}</span>}
      </div>

      <div className="quest-actions">
        {quest.status === 'available' && (
          <button className="quest-button" onClick={handleStart}>
            Accept
          </button>
        )}
        {quest.status === 'in_progress' && (
          <button className="quest-button" onClick={handleComplete}>
            Complete
          </button>
        )}
        <Link to={`/quests/${quest.id}`} className="quest-button secondary">
          Details →
        </Link>
      </div>
    </div>
  );
}

QuestCard.propTypes = {
  quest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    reward_xp: PropTypes.number,
    reward_coins: PropTypes.number,
    reward_item: PropTypes.string,
  }).isRequired,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
};

QuestCard.defaultProps = {
  onStart: undefined,
  onComplete: undefined,
};
