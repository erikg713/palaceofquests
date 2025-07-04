const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/:uid', async (req, res) => {
  const { uid } = req.params;
  const result = await db.query('SELECT * FROM players WHERE pi_uid = $1', [uid]);
  res.json(result.rows[0]);
});

module.exports = router;

