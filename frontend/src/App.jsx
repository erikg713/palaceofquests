import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css'; // Move styles here

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
