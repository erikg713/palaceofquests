import React, { useState, useContext, useCallback } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentModal from '../components/PiPaymentModal';
import RewardModal from '../components/RewardModal';

const REALM = {
  id: 'moon_fortress',
  name: 'Moon Fortress',
  unlockCost: 2
};

export default function WorldHub() {
  const { walletAddress, piUser } = useContext(PiWalletContext);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [loot, setLoot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handles unlocking the realm and granting loot
  const handleUnlockRealm = useCallback(async () => {
    if (!piUser?.uid) return;

    setLoading(true);

    try {
      // Unlock the realm
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: piUser.uid,
          realm_id: REALM.id
        })
      });

      // Grant loot to the user
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/grant-loot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: piUser.uid,
          realm_id: REALM.id
        })
      });

      const data = await res.json();
      setLoot(data?.granted || null);
      setShowReward(true);
    } catch (err) {
      alert('Something went wrong unlocking the realm. Please try again.');
    } finally {
      setLoading(false);
      setShowPayModal(false);
    }
  }, [piUser]);

  if (!walletAddress) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">Connect Pi Wallet to Continue</h2>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Welcome to the World Hub <span role="img" aria-label="globe">🌍</span>
      </h1>
      <p className="text-white">
        Realm: <span className="font-semibold">{REALM.name}</span>
      </p>
      <button
        className="bg-yellow-500 px-4 py-2 rounded text-black font-bold hover:bg-yellow-400 transition"
        onClick={() => setShowPayModal(true)}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Unlock ${REALM.name} for ${REALM.unlockCost} π`}
      </button>

      <PiPaymentModal
        visible={showPayModal}
        onClose={() => setShowPayModal(false)}
        userId={piUser?.uid}
        payload={{
          amount: REALM.unlockCost,
          memo: `Unlock ${REALM.name}`,
          metadata: { type: 'unlock', realm_id: REALM.id },
          onSuccess: handleUnlockRealm
        }}
      />

      <RewardModal
        visible={showReward}
        onClose={() => setShowReward(false)}
        loot={loot}
      />
    </div>
  );
}
