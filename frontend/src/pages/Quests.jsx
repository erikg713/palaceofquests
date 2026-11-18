import React, { useState, useCallback } from 'react';
import QuestList from '../components/quest/QuestList';
import {
  questsWithProgress,
  loadQuestProgress,
  saveQuestProgress,
} from '../data/quests';
import { inventoryData } from '../data/items';

const LOOT_KEY = 'poq-inventory-v1';

function grantLoot(itemId) {
  if (!itemId) return;
  try {
    const raw = localStorage.getItem(LOOT_KEY);
    const owned = raw ? JSON.parse(raw) : [];
    if (!owned.includes(itemId)) {
      owned.push(itemId);
      localStorage.setItem(LOOT_KEY, JSON.stringify(owned));
    }
  } catch {
    // storage unavailable — loot just won't persist
  }
}

function itemName(itemId) {
  const all = Object.values(inventoryData).flat();
  return all.find((i) => i.id === itemId)?.name || itemId;
}

export default function Quests() {
  const [quests, setQuests] = useState(() => questsWithProgress());
  const [notice, setNotice] = useState('');

  const updateStatus = useCallback((questId, status) => {
    const progress = loadQuestProgress();
    progress[questId] = status;
    saveQuestProgress(progress);
    setQuests(questsWithProgress());
  }, []);

  const handleStart = useCallback(
    (quest) => {
      updateStatus(quest.id, 'in_progress');
      setNotice(`Quest accepted: ${quest.title}`);
    },
    [updateStatus]
  );

  const handleComplete = useCallback(
    (quest) => {
      updateStatus(quest.id, 'completed');
      grantLoot(quest.reward_item);
      setNotice(
        `Quest complete: ${quest.title} — +${quest.reward_xp} XP` +
          (quest.reward_coins > 0 ? `, +${quest.reward_coins} Pi` : '') +
          (quest.reward_item ? `, looted ${itemName(quest.reward_item)}` : '')
      );
    },
    [updateStatus]
  );

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-2">Available Quests</h1>
      <p className="text-sm text-gray-400 mb-4">
        Progress is saved on this device until the backend quest tables are
        connected.
      </p>
      {notice && (
        <div className="notice mb-4" role="status">
          {notice}
        </div>
      )}
      <QuestList
        quests={quests}
        onStart={handleStart}
        onComplete={handleComplete}
      />
    </div>
  );
}
