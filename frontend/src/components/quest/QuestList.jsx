import React from 'react';
import PropTypes from 'prop-types';
import QuestCard from './QuestCard';

export default function QuestList({ quests, onStart, onComplete }) {
  if (!quests || quests.length === 0) {
    return <p className="text-gray-400">No quests here yet. Check back soon.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quests.map((q) => (
        <QuestCard key={q.id} quest={q} onStart={onStart} onComplete={onComplete} />
      ))}
    </div>
  );
}

QuestList.propTypes = {
  quests: PropTypes.arrayOf(PropTypes.object).isRequired,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
};

QuestList.defaultProps = {
  onStart: undefined,
  onComplete: undefined,
};
