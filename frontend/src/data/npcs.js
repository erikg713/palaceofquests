export const npcs = [
  {
    id: 'luna_guard',
    name: 'Luna Guard',
    avatar: '/avatars/luna.png',
    dialogTree: {
      greeting: "Greetings, warrior. What brings you to Moon Fortress?",
      options: [
        {
          text: "Looking for quests.",
          next: "quest_offer"
        },
        {
          text: "Just exploring.",
          next: "casual_reply"
        }
      ],
      branches: {
        quest_offer: {
          text: "A shadow moves beyond the crater. Are you brave enough to face it?",
          actions: [
            {
              type: "pi_payment",
              amount: 1,
              memo: "Accept Elite Quest",
              metadata: { npcId: "luna_guard", quest: "shadow_crater" },
              onSuccess: "quest_unlocked"
            }
          ]
        },
        casual_reply: {
          text: "Then enjoy the stars, traveler."
        },
        quest_unlocked: {
          text: "Take this relic. The path to the crater is open."
        }
      }
    }
  }
];