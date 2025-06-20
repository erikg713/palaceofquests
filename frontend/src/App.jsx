import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css'; // Move styles here
import { useState } from 'react';
import { createA2UPayment, submitPayment, completePayment } from './api/paymentService';

function App() {
  const [rewardStatus, setRewardStatus] = useState(null);
  const uid = 'test_user_123'; // Replace with real authenticated user ID

  const rewardUser = async () => {
    try {
      setRewardStatus('Creating reward...');
      const { paymentId } = await createA2UPayment({
        amount: 1,
        memo: 'Quest reward for Dragon Battle',
        metadata: { questId: 'dragon01' },
        uid
      });

      setRewardStatus('Submitting to Pi chain...');
      const { txid } = await submitPayment(paymentId);

      setRewardStatus('Completing payment...');
      const result = await completePayment(paymentId, txid);

      setRewardStatus(`✅ Reward sent: ${result.payment.amount} Pi`);
    } catch (err) {
      setRewardStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Palace of Quests</h1>
      <button onClick={rewardUser}>Reward Player (1 Pi)</button>
      {rewardStatus && <p>{rewardStatus}</p>}
    </div>
  );
}

export default App;

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Quests = lazy(() => import('./pages/Quests'));

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/quests', label: 'Quests' },
];

const Navigation = memo(() => (
  <nav role="navigation" aria-label="Main navigation">
    <ul className="navigation-list">
      {navLinks.map(({ path, label }) => (
        <li key={path}>
          <NavLink
            to={path}
            style={({ isActive }) => ({
              color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal',
            })}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
));

export default function App() {
  return (
    <Router>
      <header>
        <Navigation />
      </header>
      <main className="main-content">
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/quests" element={<Quests />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}
