import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getQuestById,
  loadQuestProgress,
  saveQuestProgress,
} from '../data/quests';
import { realms } from '../data/realms';
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

export default function QuestDetail() {
  const { id } = useParams();
  const [quest, setQuest] = useState(() => getQuestById(id));
  const [notice, setNotice] = useState('');

  if (!quest) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Quest not found.</h1>
        <p className="text-gray-400 mt-2">
          That quest does not exist — or it was already retired.
        </p>
        <Link to="/quests" className="text-gold hover:underline mt-4 inline-block">
          ← Back to quests
        </Link>
      </div>
    );
  }

  const realm = realms.find((r) => r.id === quest.realm);

  const setStatus = (status) => {
    const progress = loadQuestProgress();
    progress[quest.id] = status;
    saveQuestProgress(progress);
    setQuest(getQuestById(quest.id));
  };

  const handleStart = () => {
    setStatus('in_progress');
    setNotice(`Quest accepted: ${quest.title}`);
  };

  const handleComplete = () => {
    setStatus('completed');
    grantLoot(quest.reward_item);
    setNotice(
      `Quest complete — +${quest.reward_xp} XP` +
        (quest.reward_coins > 0 ? `, +${quest.reward_coins} Pi` : '') +
        (quest.reward_item ? `, looted ${itemName(quest.reward_item)}` : '')
    );
  };

  return (
    <div className="py-8">
      <Link to="/quests" className="text-sm text-gold hover:underline">
        ← Back to quests
      </Link>
      <div className="palace-card mt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold">{quest.title}</h1>
          <span className="quest-status">
            {String(quest.status).replace('_', ' ')}
          </span>
        </div>
        {realm && (
          <p className="text-sm text-gray-400 mt-1">Realm: {realm.name}</p>
        )}
        <p className="text-gray-200 mt-4">{quest.description}</p>
        <div className="quest-rewards mt-4">
          {quest.reward_xp > 0 && <span>⭐ {quest.reward_xp} XP</span>}
          {quest.reward_coins > 0 && <span>🪙 {quest.reward_coins} Pi</span>}
          {quest.reward_item && <span>🎁 {itemName(quest.reward_item)}</span>}
        </div>
        {notice && (
          <div className="notice mt-4" role="status">
            {notice}
          </div>
        )}
        <div className="quest-actions mt-4">
          {quest.status === 'available' && (
            <button className="quest-button" onClick={handleStart}>
              Accept quest
            </button>
          )}
          {quest.status === 'in_progress' && (
            <button className="quest-button" onClick={handleComplete}>
              Complete quest
            </button>
          )}
          {quest.status === 'completed' && (
            <span className="text-green-400 font-semibold">
              ✓ Completed — rewards claimed.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
