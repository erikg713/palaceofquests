import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Marketplace from './pages/Marketplace';
import Quests from './pages/Quests';

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/quests">Quests</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/quests" element={<Quests />} />
      </Routes>
    </Router>
  );
}
