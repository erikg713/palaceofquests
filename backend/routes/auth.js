import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Unauthorized'; // Create this
import Loading from './components/Loading'; // Create this
// server.js or routes/auth.js
const express = require('express');
const router = express.Router();
const verifyPiToken = require('../utils/verifyPiToken'); // You write this

router.post('/auth/pi', async (req, res) => {
  const { accessToken } = req.body;

  try {
    const piUser = await verifyPiToken(accessToken); // Returns { username, uid }

    // Fetch from DB or mock a role
    const user = {
      username: piUser.username,
      uid: piUser.uid,
      role: piUser.username === 'admin_user' ? 'admin' : 'user', // Simple logic
    };

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid Pi token' });
  }
});

module.exports = router;

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const Pi = window.Pi;

    if (!Pi) {
      setError('Pi SDK not found. Please open in the Pi Browser.');
      setLoading(false);
      return;
    }

    Pi.authenticate(['username'], async (err, auth) => {
      if (err) {
        setError('Pi authentication failed.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/auth/pi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: auth.accessToken }),
        });

        if (!res.ok) throw new Error('Server validation failed');

        const userData = await res.json();

        // Optional: Save user in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (err) {
        console.error('Backend error:', err);
        setError('Server error. Try again later.');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  // Role-based access control
  if (user && user.role !== 'admin') return <Unauthorized user={user} />;

  return user ? <Dashboard user={user} /> : <div>Not authenticated.</div>;
}

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
