import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const Pi = window.Pi;
    Pi.authenticate(['username'], () => {}).then(async (auth) => {
      const res = await fetch('http://localhost:5000/auth/pi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: auth.accessToken }),
      });

      const data = await res.json();
      setUser(data);
    });
  }, []);

  return user ? <Dashboard user={user} /> : <div>Authenticating Pi user...</div>;
}
