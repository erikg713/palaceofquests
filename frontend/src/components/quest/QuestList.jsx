import React from 'react';
import QuestCard from './QuestCard';

export default function QuestList({ quests }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quests.map(q => <QuestCard key={q.id} quest={q} />)}
    </div>
  );
}
