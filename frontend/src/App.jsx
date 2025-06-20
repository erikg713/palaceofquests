import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import usePayment from './hooks/usePayment'; // Custom hook moved to a separate file
import './App.css';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Quests = lazy(() => import('./pages/Quests'));

// Navigation links config
const navLinks = [
  { route: '/', label: 'Home' },
  { route: '/inventory', label: 'Inventory' },
  { route: '/marketplace', label: 'Marketplace' },
  { route: '/quests', label: 'Quests' },
];

// Navigation component
const Navigation = memo(() => (
  <nav aria-label="Main navigation">
    <ul className="navigation-list">
      {navLinks.map(({ route, label }) => (
        <li key={route}>
          <NavLink
            to={route}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            aria-current={window.location.pathname === route ? 'page' : undefined}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
));

function App() {
  // Use environment variable for user ID, fallback for local development
  const uid = process.env.REACT_APP_USER_ID || 'test_user_123';
  const { rewardStatus, rewardUser, isProcessing } = usePayment(uid);

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
        <section className="reward-container">
          <button
            type="button"
            onClick={rewardUser}
            disabled={isProcessing}
            aria-busy={isProcessing}
            className="reward-btn"
          >
            {isProcessing ? 'Processing...' : 'Reward Player (1 Pi)'}
          </button>
          {rewardStatus && (
            <p className={`reward-status${rewardStatus.startsWith('✅') ? ' success' : rewardStatus.startsWith('❌') ? ' error' : ''}`}
               role="status"
               aria-live="polite"
            >
              {rewardStatus}
            </p>
          )}
        </section>
      </main>
    </Router>
  );
}

export default App;
