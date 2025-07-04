// backend/auth.js
const { query } = require('./db');
const fetch = require('node-fetch');

async function loginUser(req, res) {
  const { accessToken } = req.body;
  try {
    const piUser = await fetch('https://api.minepi.com/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(res => res.json());

    const { uid, username } = piUser;

    const result = await query('SELECT * FROM players WHERE pi_uid = $1', [uid]);

    if (result.rowCount === 0) {
      await query(
        'INSERT INTO players (pi_uid, username, level, experience) VALUES ($1, $2, 1, 0)',
        [uid, username]
      );
    }

    res.status(200).json({ uid, username });
  } catch (err) {
    console.error('[AUTH] Error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { loginUser };
