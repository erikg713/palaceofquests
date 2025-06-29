/**
 * List of realms for the Palace of Quests game.
 * Each realm object defines unlock requirements, visual location, and metadata.
 * Extend this file as new realms are added.
 *
 * @typedef {Object} Realm
 * @property {string} id
 * @property {string} name
 * @property {number} unlockCost
 * @property {string} description
 * @property {[number, number]} coordinates
 * @property {string} image
 */

/** @type {Realm[]} */
export const realms = [
  {
    id: 'moon_fortress',
    name: 'Moon Fortress',
    unlockCost: 2,
    description: 'A defensive stronghold orbiting Earth.',
    coordinates: [200, 150],
    image: '/maps/moon.png',
    // difficulty: 'easy',
    // tags: ['space', 'defense'],
  },
  {
    id: 'plasma_citadel',
    name: 'Plasma Citadel',
    unlockCost: 3,
    description: 'A volcanic realm crackling with energy.',
    coordinates: [400, 300],
    image: '/maps/plasma.png',
    // difficulty: 'medium',
    // tags: ['volcano', 'energy'],
  },
];

// (Optional for development only)
function validateRealms(realms) {
  for (const realm of realms) {
    if (
      typeof realm.id !== 'string' ||
      typeof realm.name !== 'string' ||
      typeof realm.unlockCost !== 'number' ||
      typeof realm.description !== 'string' ||
      !Array.isArray(realm.coordinates) ||
      realm.coordinates.length !== 2 ||
      typeof realm.image !== 'string'
    ) {
      throw new Error(`Invalid realm data: ${JSON.stringify(realm)}`);
    }
  }
}
// validateRealms(realms);
