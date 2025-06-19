import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Quests = lazy(() => import('./pages/Quests'));

const navLinks = [
  { path: '/', label: 'Home', exact: true },
  { path: '/inventory', label: 'Inventory' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/quests', label: 'Quests' },
];

export default function App() {
  return (
    <Router>
      <header>
        <nav aria-label="Main navigation">
          <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {navLinks.map(({ path, label, exact }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={exact}
                  style={({ isActive }) => ({
                    color: isActive ? '#0070f3' : '#333',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                  })}
                  aria-current={window.location.pathname === path ? 'page' : undefined}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main style={{ padding: '2rem 0' }}>
        <Suspense fallback={<div>Loading...</div>}>
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
