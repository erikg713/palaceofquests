import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AchievementGallery from './components/AchievementGallery';
// Context Providers
import { PiAuthProvider } from './context/PiAuthContext';
import { PlayerProvider } from './context/PlayerContext';
// Pages
import Home from './pages/Home';
import Quests from './pages/Quests';
import Marketplace from './pages/Marketplace';
import InventoryPage from './pages/InventoryPage';
import WorldHub from './pages/WorldHub';
import WorldMapPage from './pages/WorldMapPage';
import NPCPage from './pages/NPCPage';
// Components
import Navbar from './components/Navbar';
import QuestLog from './components/QuestLog';
import LanguageToggle from './components/LanguageToggle';
import GameOverlay from './components/GameOverlay';
// Hooks
import { usePiAuth } from './hooks/usePiAuth';

const App = () => {
  const { user, loginWithPi, unlockQuest } = usePiAuth();

  return (
    <PiAuthProvider>
      <PlayerProvider>
        <Router>
          <Navbar />
          <div className="App">
            <LanguageToggle />
            <h1>Palace of Quests</h1>

            {user ? (
              <div>
                <p>Welcome, {user.username}!</p>
                <QuestLog uid={user.uid} />
                <button type="button" onClick={unlockQuest}>
                  Unlock Dragon Quest
                </button>
              </div>
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
      </PlayerProvider>
    </PiAuthProvider>
  );
};

export default App;
