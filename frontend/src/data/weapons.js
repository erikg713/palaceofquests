// Weapon data definitions and utilities

/**
 * Weapon rarity levels (enum-like for consistency)
 */
export const RARITY = Object.freeze({
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
});

/**
 * Master weapon list.
 */
const weapons = [
  {
    id: "swd001",
    name: "Iron Sword",
    type: "sword",
    damage: 12,
    weight: 5,
    rarity: RARITY.COMMON,
    description: "Reliable and sturdy, favored by novice adventurers.",
  },
  {
    id: "axe002",
    name: "Battle Axe",
    type: "axe",
    damage: 18,
    weight: 8,
    rarity: RARITY.UNCOMMON,
    description: "Heavy, but devastating in the right hands.",
  },
  {
    id: "bow003",
    name: "Longbow",
    type: "bow",
    damage: 10,
    weight: 3,
    rarity: RARITY.COMMON,
    description: "Enables ranged attacks with precision.",
  },
  {
    id: "dag004",
    name: "Shadow Dagger",
    type: "dagger",
    damage: 8,
    weight: 1,
    rarity: RARITY.RARE,
    description: "Light and quick, perfect for stealth attacks.",
  },
  // Extend as needed
];

/**
 * Fast lookup map for weapons by ID
 */
const weaponMap = weapons.reduce((map, weapon) => {
  map[weapon.id] = weapon;
  return map;
}, {});

/**
 * Get a weapon by its unique ID
 * @param {string} id
 * @returns {object|null}
 */
export function getWeaponById(id) {
  return weaponMap[id] || null;
}

/**
 * Get all weapons of a specific type
 * @param {string} type
 * @returns {object[]}
 */
export function getWeaponsByType(type) {
  return weapons.filter((w) => w.type === type);
}

/**
 * Get all weapons by rarity
 * @param {string} rarity
 * @returns {object[]}
 */
export function getWeaponsByRarity(rarity) {
  return weapons.filter((w) => w.rarity === rarity);
}

/**
 * Get all weapons
 * @returns {object[]}
 */
export function getAllWeapons() {
  return weapons.slice();
}

export default weapons;
