import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestLog from './components/QuestLog';
import Home from './pages/Home';
import Quests from './pages/Quests';
import Marketplace from './pages/Marketplace';
import { usePiAuth } from './hooks/usePiAuth';

const App = () => {
  const { user, loginWithPi, unlockQuest } = usePiAuth();

  return (
    <Router>
      <div className="App">
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
          <Route path="/" element={<Home />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
