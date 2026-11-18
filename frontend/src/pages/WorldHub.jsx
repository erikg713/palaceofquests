import React, { useContext, useState } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentButton from '../components/PiPaymentButton';
import { realms } from '../data/realms';

const UNLOCKED_KEY = 'poq-realms-v1';

function loadUnlocked() {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUnlocked(ids) {
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable — unlocks just won't persist
  }
}

export default function WorldHub() {
  const { walletAddress, piUser, connectWallet } = useContext(PiWalletContext);
  const [unlocked, setUnlocked] = useState(loadUnlocked);
  const [notice, setNotice] = useState('');

  const handleUnlocked = (realm) => {
    if (!unlocked.includes(realm.id)) {
      const next = [...unlocked, realm.id];
      setUnlocked(next);
      saveUnlocked(next);
    }
    setNotice(`${realm.name} unlocked — the way is open.`);
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {piUser ? piUser.username : 'Explorer'}
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        The World Hub — every realm of the palace, from one gate.
      </p>

      {!walletAddress && (
        <div className="notice mb-6">
          Connect your Pi Wallet to unlock realms with Pi. You can still look
          around without signing in.
          <button
            onClick={connectWallet}
            className="ml-3 font-semibold text-gold hover:underline"
          >
            Connect Pi Wallet
          </button>
        </div>
      )}

      {notice && (
        <div className="notice mb-6" role="status">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {realms.map((realm) => {
          const isUnlocked = unlocked.includes(realm.id);
          return (
            <div key={realm.id} className="palace-card realm-card">
              <h2 className="text-xl font-bold">{realm.name}</h2>
              <p className="text-sm text-gray-300 mt-1">{realm.description}</p>
              <p className="mt-3 text-sm">
                Unlock cost:{' '}
                <span className="text-gold font-bold">
                  {realm.unlockCost} Pi
                </span>
              </p>
              <div className="mt-4">
                {isUnlocked ? (
                  <span className="text-green-400 font-semibold">
                    ✓ Unlocked — explore freely.
                  </span>
                ) : walletAddress ? (
                  <PiPaymentButton
                    amount={realm.unlockCost}
                    memo={`Unlock ${realm.name}`}
                    metadata={{ realm: realm.id, type: 'realm_unlock' }}
                    onPaymentComplete={() => handleUnlocked(realm)}
                  />
                ) : (
                  <span className="text-sm text-gray-400">
                    Sign in with Pi to unlock this realm.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-6">
        Realm unlocks are recorded on this device for now. Pi payments need a
        backend to approve and complete them — until one is connected, the
        payment step runs in Pi Browser up to server approval.
      </p>
    </div>
  );
}
