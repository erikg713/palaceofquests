const fetch = require('node-fetch');
const db = require('./db');

async function verifyPiUser(accessToken) {
  const res = await fetch('https://api.minepi.com/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await res.json();
  return user;
}

async function loginUser(req, res) {
  const { accessToken } = req.body;
  try {
    const user = await verifyPiUser(accessToken);
    const { uid, username } = user;

    let result = await db.query('SELECT * FROM players WHERE pi_uid = $1', [uid]);
    if (result.rowCount === 0) {
      await db.query(
        'INSERT INTO players (pi_uid, username, level, experience) VALUES ($1, $2, 1, 0)',
        [uid, username]
      );
    }

    res.status(200).json({ uid, username });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token or user not found' });
  }
}

module.exports = { loginUser };

