import React, { Suspense, lazy, memo, useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { createA2UPayment, submitPayment, completePayment } from './api/paymentService';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Quests = lazy(() => import('./pages/Quests'));

// Navigation Links
const navLinks = [
  { route: '/', label: 'Home' },
  { route: '/inventory', label: 'Inventory' },
  { route: '/marketplace', label: 'Marketplace' },
  { route: '/quests', label: 'Quests' },
];

// Navigation Component
const Navigation = memo(() => (
  <nav role="navigation" aria-label="Main navigation">
    <ul className="navigation-list">
      {navLinks.map(({ route, label }) => (
        <li key={route}>
          <NavLink
            to={route}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
));

// Custom Hook for Payment Logic
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
      console.error('Payment Error:', err);
      setRewardStatus(`❌ Error: ${err.message || 'Unknown error occurred'}`);
    }
  }, [uid]);

  return { rewardStatus, rewardUser };
};

// Main App Component
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
          <button onClick={rewardUser} disabled={rewardStatus?.startsWith('Creating')}>
            Reward Player (1 Pi)
          </button>
          {rewardStatus && <p aria-live="polite">{rewardStatus}</p>}
        </div>
      </main>
    </Router>
  );
}
