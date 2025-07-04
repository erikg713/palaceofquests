import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Unauthorized'; // Create this
import Loading from './components/Loading'; // Create this

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
