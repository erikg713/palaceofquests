const express = require('express');
const router = express.Router();
const verifyPiToken = require('../middlewares/piAuth');

router.get('/me', verifyPiToken, (req, res) => {
  const user = req.piUser;
  res.json({ message: `Welcome back, ${user.username}`, uid: user.uid });
});

module.exports = router;
const express = require('express');
const db = require('../db');
const router = express.Router();

/**
 * GET player by UID
 * Fetches a player's data based on their unique identifier.
 */
router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;

        // SQL query with parameterized input to prevent SQL injection
        const result = await db.query('SELECT * FROM players WHERE pi_uid = $1', [uid]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Respond with the player's data
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
