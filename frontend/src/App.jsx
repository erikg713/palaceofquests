import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Unauthorized';
import Loading from './components/Loading';
import Router from './router';

export default function App() {
  return <Router />;
}
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const Pi = window.Pi;

    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      setLoading(false);
      return;
    }

    if (!Pi) {
      setError('Pi SDK not found. Please open this app in the Pi Browser.');
      setLoading(false);
      return;
    }

    Pi.authenticate(['username'], async (err, auth) => {
      if (err) {
        setError('Authentication with Pi Network failed.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/auth/pi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: auth.accessToken }),
        });

        if (!res.ok) throw new Error('Backend auth failed');

        const userData = await res.json();
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError('Server error while verifying user.');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  if (user && user.role !== 'admin') return <Unauthorized user={user} />;

  return user ? <Dashboard user={user} /> : <div>Not authenticated.</div>;
}

