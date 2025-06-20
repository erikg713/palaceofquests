import React, { Suspense, lazy, memo, useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { createA2UPayment, submitPayment, completePayment } from './api/paymentService';

const Home = lazy(() => import('./pages/Home'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Quests = lazy(() => import('./pages/Quests'));

const navLinks = [
  { route: '/', label: 'Home' },
  { route: '/inventory', label: 'Inventory' },
  { route: '/marketplace', label: 'Marketplace' },
  { route: '/quests', label: 'Quests' },
];

const Navigation = memo(() => (
  <nav role="navigation" aria-label="Main navigation">
    <ul className="navigation-list">
      {navLinks.map(({ route, label }) => (
        <li key={route}>
          <NavLink
            to={route}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
));

const usePayment = (uid) => {
  const [rewardStatus, setRewardStatus] = useState(null);

  const rewardUser = useCallback(async () => {
    try {
      setRewardStatus('Creating reward...');
      const { paymentId } = await createA2UPayment({
        amount: 1,
        memo: 'Quest reward for Dragon Battle',
        metadata: { questId: 'dragon01' },
        uid,
      });

      setRewardStatus('Submitting to Pi chain...');
      const { txid } = await submitPayment(paymentId);

      setRewardStatus('Completing payment...');
      const result = await completePayment(paymentId, txid);

      setRewardStatus(`✅ Reward sent: ${result.payment.amount} Pi`);
    } catch (err) {
      console.error(err);
      setRewardStatus(`❌ Error: ${err.message || 'Unknown error occurred'}`);
    }
  }, [uid]);

  return { rewardStatus, rewardUser };
};

export default function App() {
  const uid = process.env.REACT_APP_USER_ID || 'test_user_123';
  const { rewardStatus, rewardUser } = usePayment(uid);

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
        <div className="reward-container">
          <button onClick={rewardUser}>Reward Player (1 Pi)</button>
          {rewardStatus && <p aria-live="polite">{rewardStatus}</p>}
        </div>
      </main>
    </Router>
  );
}
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
