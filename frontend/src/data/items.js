// frontend/src/data/items.js

/**
 * @typedef {'common' | 'rare' | 'epic' | 'legendary'} Rarity
 * @typedef {Object} InventoryItem
 * @property {string} id
 * @property {string} name
 * @property {Rarity} rarity
 * @property {number} stars
 * @property {string} icon
 * @property {string} description
 */

/** Rarity constants for consistency */
export const RARITY = Object.freeze({
  COMMON: "common",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
});

/** @type {{ [category: string]: InventoryItem[] }} */
export const inventoryData = {
  weapons: [
    {
      id: "w1",
      name: "Elder Sword",
      rarity: RARITY.EPIC,
      stars: 4,
      icon: "🗡️",
      description: "A mighty sword imbued with ancient power.",
    },
    {
      id: "w2",
      name: "Mystic Bow",
      rarity: RARITY.RARE,
      stars: 3,
      icon: "🏹",
      description: "A bow crafted with magical properties.",
    },
  ],
  armor: [
    {
      id: "a1",
      name: "Crystal Shield",
      rarity: RARITY.LEGENDARY,
      stars: 5,
      icon: "🛡️",
      description: "A shield forged from enchanted crystals.",
    },
    {
      id: "a2",
      name: "Shadow Cloak",
      rarity: RARITY.RARE,
      stars: 3,
      icon: "🧥",
      description: "A cloak that conceals the wearer in darkness.",
    },
  ],
  potions: [
    {
      id: "p1",
      name: "Health Potion",
      rarity: RARITY.COMMON,
      stars: 2,
      icon: "🧪",
      description: "Restores a moderate amount of health.",
    },
    {
      id: "p2",
      name: "Mana Elixir",
      rarity: RARITY.EPIC,
      stars: 4,
      icon: "🔮",
      description: "Replenishes a large portion of mana.",
    },
  ],
  artifacts: [
    {
      id: "ar1",
      name: "Time Orb",
      rarity: RARITY.LEGENDARY,
      stars: 5,
      icon: "🌀",
      description: "Manipulates the flow of time itself.",
    },
    {
      id: "ar2",
      name: "Fire Crystal",
      rarity: RARITY.EPIC,
      stars: 4,
      icon: "🔥",
      description: "Channels the power of fire.",
    },
  ],
};

/**
 * Validates inventory data structure.
 * Throws an error if validation fails.
 */
function validateInventoryData(data) {
  for (const [cat, items] of Object.entries(data)) {
    items.forEach((item) => {
      if (
        !item.id ||
        !item.name ||
        !Object.values(RARITY).includes(item.rarity) ||
        typeof item.stars !== "number" ||
        !item.icon ||
        !item.description
      ) {
        throw new Error(
          `Invalid item in category "${cat}": ${JSON.stringify(item)}`,
        );
      }
    });
  }
}
validateInventoryData(inventoryData);

/**
 * Retrieve all items by rarity
 * @param {Rarity} rarity
 * @returns {InventoryItem[]}
 */
export function getItemsByRarity(rarity) {
  return Object.values(inventoryData)
    .flat()
    .filter((item) => item.rarity === rarity);
}

/**
 * Retrieve all items from a category sorted by stars (descending)
 * @param {string} category
 * @returns {InventoryItem[]}
 */
export function getSortedItemsByStars(category) {
  return [...(inventoryData[category] || [])].sort((a, b) => b.stars - a.stars);
}
