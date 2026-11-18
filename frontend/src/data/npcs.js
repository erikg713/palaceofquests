// NPC Data: Contains all dialog and interaction logic for in-game NPCs.

// Constants for action types to ensure consistency (defined before use).
export const ACTION_TYPES = {
  PI_PAYMENT: 'pi_payment',
};

export const npcs = [
  {
    id: 'luna_guard',
    name: 'Luna Guard',
    // No NPC avatar art ships with the app yet; the dialog renders the
    // NPC's initial in place of an image until portraits are added.
    avatar: null,
    dialogTree: {
      greeting: 'Greetings, warrior. What brings you to Moon Fortress?',
      options: [
        {
          text: 'Looking for quests.',
          next: 'quest_offer',
        },
        {
          text: 'Just exploring.',
          next: 'casual_reply',
        },
      ],
      branches: {
        quest_offer: {
          text: 'A shadow moves beyond the crater. Are you brave enough to face it?',
          actions: [
            {
              type: ACTION_TYPES.PI_PAYMENT,
              amount: 1,
              memo: 'Accept Elite Quest',
              metadata: { npcId: 'luna_guard', quest: 'shadow_crater' },
              onSuccess: 'quest_unlocked',
              onError: 'payment_failed',
            },
          ],
        },
        casual_reply: {
          text: 'Then enjoy the stars, traveler.',
        },
        quest_unlocked: {
          text: 'Take this relic. The path to the crater is open.',
        },
        payment_failed: {
          text: 'Transaction failed. Please try again later.',
        },
      },
    },
  },
];
