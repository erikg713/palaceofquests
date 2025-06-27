/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {'easy'|'medium'|'hard'} [difficulty]
 * @property {string} [category]
 */

export const allAchievements = [
  {
    id: "first_quest",
    name: "First Blood",
    description: "Complete your very first quest.",
    icon: "/badges/first_quest.png",
    difficulty: "easy",
    category: "progression",
  },
  {
    id: "pi_spender",
    name: "Pi Spender",
    description: "Spend Pi tokens on any upgrade.",
    icon: "/badges/pi_spender.png",
    difficulty: "easy",
    category: "economy",
  },
  {
    id: "moon_unlock",
    name: "Moon Explorer",
    description: "Unlock the Moon Fortress realm.",
    icon: "/badges/moon_unlock.png",
    difficulty: "medium",
    category: "exploration",
  },
  {
    id: "fusion_master",
    name: "Fusion Master",
    description: "Fuse two gear items together.",
    icon: "/badges/fusion_master.png",
    difficulty: "medium",
    category: "crafting",
  },
];

export const getAchievementById = (id) =>
  allAchievements.find((achievement) => achievement.id === id);

export const groupAchievementsByCategory = () =>
  allAchievements.reduce((acc, achievement) => {
    const category = achievement.category || "misc";
    if (!acc[category]) acc[category] = [];
    acc[category].push(achievement);
    return acc;
  }, {});
