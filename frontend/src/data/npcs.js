// NPC Data: Contains all dialog and interaction logic for in-game NPCs.
export const npcs = [
  {
    id: 'luna_guard', // Unique identifier for the NPC
    name: 'Luna Guard', // Display name
    avatar: getAvatarPath('luna'), // Dynamic avatar path
    dialogTree: {
      greeting: "Greetings, warrior. What brings you to Moon Fortress?", // Initial dialog
      options: [
        {
          text: "Looking for quests.",
          next: "quest_offer",
        },
        {
          text: "Just exploring.",
          next: "casual_reply",
        },
      ],
      branches: {
        quest_offer: {
          text: "A shadow moves beyond the crater. Are you brave enough to face it?",
          actions: [
            {
              type: ACTION_TYPES.PI_PAYMENT,
              amount: 1,
              memo: "Accept Elite Quest",
              metadata: { npcId: "luna_guard", quest: "shadow_crater" },
              onSuccess: "quest_unlocked",
              onError: "payment_failed", // Optional error handler
            },
          ],
        },
        casual_reply: {
          text: "Then enjoy the stars, traveler.",
        },
        quest_unlocked: {
          text: "Take this relic. The path to the crater is open.",
        },
        payment_failed: {
          text: "Transaction failed. Please try again later.",
        },
      },
    },
  },
];

// Helper function to dynamically get avatar paths
function getAvatarPath(name) {
  return `/avatars/${name}.png`;
}

// Constants for action types to ensure consistency
const ACTION_TYPES = {
  PI_PAYMENT: "pi_payment",
};
];
