import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import usePayment from './hooks/usePayment'; // Custom hook moved to a separate file
import './App.css';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  const loginWithPi = async () => {
    try {
      const scopes = ['username', 'payments'];
      const auth = await window.Pi.authenticate(scopes, (payment) => {
        console.log('Incomplete payment found:', payment);
      });
      setUser(auth.user);
      console.log('Logged in as:', auth.user.username);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="App">
      <h1>Palace of Quests</h1>
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <button onClick={loginWithPi}>Login with Pi Wallet</button>
      )}
    </div>
  );
}

export default App;
