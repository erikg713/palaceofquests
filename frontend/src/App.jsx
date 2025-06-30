import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import PiWallet from "./components/PiWallet";

function App() {
  return (
    <div>
      <h1>Palace of Quests</h1>
      <PiWallet />
    </div>
  );
}

export default App;
// Pages
import Home from './pages/Home';
import Quests from './pages/Quests';
import Marketplace from './pages/Marketplace';
import InventoryPage from './pages/InventoryPage';
import WorldHub from './pages/WorldHub';
import WorldMapPage from './pages/WorldMapPage';
import NPCPage from './pages/NPCPage';

// Components
import QuestLog from './components/QuestLog';
import LanguageToggle from './components/LanguageToggle';
import GameOverlay from './components/GameOverlay';

// Hooks
import { usePiAuth } from './hooks/usePiAuth';

const App = () => {
  const { user, loginWithPi, unlockQuest } = usePiAuth();

  return (
    <Router>
      <div className="App">
        <LanguageToggle />
        <h1>Palace of Quests</h1>
        {user ? (
          <>
            <p>Welcome, {user.username}!</p>
            <QuestLog uid={user.uid} />
            <button type="button" onClick={unlockQuest}>
              Unlock Dragon Quest
            </button>
          </>
        ) : (
          <button type="button" onClick={loginWithPi}>
            Login with Pi Wallet
          </button>
        )}
        <Routes>
          <Route path="/" element={<WorldHub />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/map" element={<WorldMapPage />} />
          <Route path="/npcs" element={<NPCPage />} />
          <Route
            path="/hud"
            element={
              <GameOverlay>
                <p>Welcome to the arena.</p>
              </GameOverlay>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorldHub from './pages/WorldHub';
import Inventory from './pages/Inventory';
import QuestBoard from './pages/QuestBoard';
import Marketplace from './pages/Marketplace';
import Navbar from './components/Navbar';
import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<WorldHub />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/quests" element={<QuestBoard />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
