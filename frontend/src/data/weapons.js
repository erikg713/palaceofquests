/**
 * Weapon data module
 * Each weapon object contains:
 * - id: Unique identifier
 * - name: Display name
 * - type: Weapon category
 * - damage: Base damage value
 * - weight: Affects character agility (lower is better)
 * - rarity: How hard it is to obtain
 * - description: Short flavor text
 */

const weapons = [
  {
    id: 'swd001',
    name: 'Iron Sword',
    type: 'sword',
    damage: 12,
    weight: 5,
    rarity: 'common',
    description: 'Reliable and sturdy, favored by novice adventurers.',
  },
  {
    id: 'axe002',
    name: 'Battle Axe',
    type: 'axe',
    damage: 18,
    weight: 8,
    rarity: 'uncommon',
    description: 'Heavy, but devastating in the right hands.',
  },
  {
    id: 'bow003',
    name: 'Longbow',
    type: 'bow',
    damage: 10,
    weight: 3,
    rarity: 'common',
    description: 'Enables ranged attacks with precision.',
  },
  {
    id: 'dag004',
    name: 'Shadow Dagger',
    type: 'dagger',
    damage: 8,
    weight: 1,
    rarity: 'rare',
    description: 'Light and quick, perfect for stealth attacks.',
  },
  // Add more weapons as needed
];

// Utility to fetch weapon by ID (for maintainability and optimization)
export const getWeaponById = (id) => weapons.find((w) => w.id === id) || null;

export default weapons;
