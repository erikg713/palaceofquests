import db from '../utils/db.js';

export const requirePiAuth = async (req, res, next) => {
  const userId = req.headers['x-pi-user'];

  if (!userId) {
    return res.status(401).json({ error: 'Missing Pi user header' });
  }

  const result = await db.query('SELECT id FROM users WHERE id = $1', [userId]);

  if (result.rows.length === 0) {
    return res.status(403).json({ error: 'Invalid Pi user' });
  }

  req.user = { id: userId };
  next();
};
