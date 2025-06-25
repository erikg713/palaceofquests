import React, { useContext } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
import './Home.css';
import PiPaymentModal from '../components/PiPaymentModal';
import { useState } from 'react';

export default function WorldHub() {
  const [showPayModal, setShowPayModal] = useState(false);

  const realm = {
    id: 'moon_fortress',
    name: 'Moon Fortress',
    unlockCost: 2
  };

  const handleUnlockRealm = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: piUser.uid, realm_id: realm.id })
    });
    alert(`${realm.name} unlocked!`);
  };

  return (
    <>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() => setShowPayModal(true)}
      >
        Unlock {realm.name} for {realm.unlockCost} π
      </button>

      <PiPaymentModal
        visible={showPayModal}
        onClose={() => setShowPayModal(false)}
        userId={piUser.uid}
        payload={{
          amount: realm.unlockCost,
          memo: `Unlock ${realm.name}`,
          metadata: { type: 'unlock', realm_id: realm.id },
          onSuccess: handleUnlockRealm
        }}
      />
    </>
  );
}
export default function Home() {
  const { walletAddress, connectWallet } = useContext(PiWalletContext);

  return (
    <div className="home-container">
      <div className="hero">
        <h1>🏰 Palace of Quests</h1>
        <p>An epic Web3 adventure built for the Pi Network.</p>
        {walletAddress ? (
          <p>Connected as: {walletAddress}</p>
        ) : (
          <button onClick={connectWallet}>Connect Pi Wallet</button>
        )}
      </div>
      <div className="features">
        <div className="feature-card">
          <h2>🌍 Explore</h2>
          <p>Enter a dynamic world full of mysteries and magic.</p>
        </div>
        <div className="feature-card">
          <h2>🏆 Earn</h2>
          <p>Complete quests to earn $PI and own real digital gear.</p>
        </div>
        <div className="feature-card">
          <h2>🤝 Play Together</h2>
          <p>Team up with others and forge your legend.</p>
        </div>
      </div>
    </div>
  );
}
import { useContext } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';

export default function Home() {
  const { walletAddress, connectWallet } = useContext(PiWalletContext);

  return (
    <div className="home">
      <h1>Palace of Quests 🏰</h1>
      <p>The Pi-powered metaverse adventure begins.</p>
      {walletAddress ? (
        <p>Connected as: {walletAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect Pi Wallet</button>
      )}
    </div>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import WorldHub from './pages/WorldHub';
import LanguageToggle from './components/LanguageToggle';

const App = () => (
  <Router>
    <LanguageToggle />
    <Routes>
      <Route path="/" element={<WorldHub />} />
      <Route path="/inventory" element={<InventoryPage />} />
    </Routes>
  </Router>
);

export default App;