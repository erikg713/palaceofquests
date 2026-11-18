// src/data/quests.js
//
// Seed quests for the two realms. This is local game content: progress is
// tracked in localStorage until the backend / Supabase quest tables are
// wired up. Quest ids are stable strings so saved progress survives edits
// to titles and rewards.

/**
 * @typedef {Object} Quest
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} realm — realm id from src/data/realms.jsx
 * @property {number} reward_xp
 * @property {number} reward_coins — Pi
 * @property {string|null} reward_item — item id from src/data/items.js, or null
 */

/** @type {Quest[]} */
export const quests = [
  {
    id: 'shadow_crater',
    title: 'Shadow Beyond the Crater',
    description:
      'The Luna Guard reports a shadow moving beyond the crater rim of Moon Fortress. ' +
      'Scout the crater, mark the patrol route, and report back before the swarm regroups.',
    realm: 'moon_fortress',
    reward_xp: 120,
    reward_coins: 1,
    reward_item: 'w1',
  },
  {
    id: 'fortress_rations',
    title: 'Rations for the Garrison',
    description:
      'The Moon Fortress garrison is low on supplies. Gather salvage from the old ' +
      'landing pads and haul it back to the quartermaster.',
    realm: 'moon_fortress',
    reward_xp: 80,
    reward_coins: 1,
    reward_item: null,
  },
  {
    id: 'plasma_conduits',
    title: 'Reroute the Plasma Conduits',
    description:
      'The Citadel’s conduits are overloading and venting into the lower halls. ' +
      'Reroute the flow through the auxiliary channels before the next surge.',
    realm: 'plasma_citadel',
    reward_xp: 150,
    reward_coins: 2,
    reward_item: 'w2',
  },
  {
    id: 'ember_watch',
    title: 'Ember Watch',
    description:
      'Ember sprites have nested in the Citadel’s cooling vents. Clear the vents ' +
      'and relight the watch beacons along the obsidian road.',
    realm: 'plasma_citadel',
    reward_xp: 100,
    reward_coins: 1,
    reward_item: null,
  },
  {
    id: 'star_chart',
    title: 'Recover the Star Chart',
    description:
      'A raider crew stole the palace star chart and fled toward the plasma fields. ' +
      'Track them, recover the chart, and bring it home to the archivist.',
    realm: 'plasma_citadel',
    reward_xp: 200,
    reward_coins: 3,
    reward_item: 'a1',
  },
  {
    id: 'first_oath',
    title: 'The First Oath',
    description:
      'Every adventurer swears the First Oath before the palace gates. Speak the oath ' +
      'to the Luna Guard and earn your place among the quest-bound.',
    realm: 'moon_fortress',
    reward_xp: 50,
    reward_coins: 0,
    reward_item: null,
  },
];

const PROGRESS_KEY = 'poq-quest-progress-v1';

/** @returns {{ [questId: string]: 'available' | 'in_progress' | 'completed' }} */
export function loadQuestProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveQuestProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // storage unavailable — progress just won't persist
  }
}

/** Quests merged with the player's saved progress (default status: available). */
export function questsWithProgress() {
  const progress = loadQuestProgress();
  return quests.map((q) => ({
    ...q,
    status: progress[q.id] || 'available',
  }));
}

export function getQuestById(id) {
  const progress = loadQuestProgress();
  const quest = quests.find((q) => q.id === id);
  if (!quest) return null;
  return { ...quest, status: progress[id] || 'available' };
}
