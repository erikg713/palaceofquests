const express = require('express');
const router = express.Router();

// Simulate DB (replace with actual DB logic)
const questsDB = [
  { id: 'dragon01', title: 'Defeat the Dragon', status: 'available' },
  { id: 'forest02', title: 'Explore the Mystic Forest', status: 'locked' }
];

// GET /quests/:uid
router.get('/:uid', (req, res) => {
  const { uid } = req.params;

  // Replace with DB query filtered by uid
  res.json({
    uid,
    quests: questsDB.map(q => ({
      ...q,
      status: Math.random() > 0.5 ? 'completed' : 'available'
    }))
  });
});

module.exports = router;
