export const loginWithPi = async (req, res) => {
  const { username, accessToken } = req.body;

  if (!username || !accessToken) {
    return res.status(400).json({ error: 'Missing Pi credentials' });
  }

  try {
    // In a real app, verify the `accessToken` with Pi SDK server (if possible)
    // For now, accept it as trusted (Pi Browser only)

    // Add user to DB if not exists
    const userCheck = await db.query(
      'SELECT id FROM users WHERE id = $1',
      [username]
    );

    if (userCheck.rows.length === 0) {
      await db.query(
        'INSERT INTO users (id, username) VALUES ($1, $2)',
        [username, username]
      );
    }

    res.json({ userId: username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
