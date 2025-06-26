import React, { useState, useContext } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentModal from '../components/PiPaymentModal';

export default function WorldHub() {
  const [showPayModal, setShowPayModal] = useState(false);
  const { walletAddress, piUser } = useContext(PiWalletContext);

  const realm = {
    id: 'moon_fortress',
    name: 'Moon Fortress',
    unlockCost: 2
  };

  const handleUnlockRealm = async () => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: piUser?.uid,
        realm_id: realm.id
      })
    });
    alert(`${realm.name} unlocked!`);
  };

  if (!walletAddress) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">Connect Pi Wallet to Continue</h2>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold text-white">Welcome to the World Hub 🌍</h1>
      <p className="text-white">Realm: {realm.name}</p>

      <button
        className="bg-yellow-500 px-4 py-2 rounded text-black font-bold"
        onClick={() => setShowPayModal(true)}
      >
        Unlock {realm.name} for {realm.unlockCost} π
      </button>

      <PiPaymentModal
        visible={showPayModal}
        onClose={() => setShowPayModal(false)}
        userId={piUser?.uid}
        payload={{
          amount: realm.unlockCost,
          memo: `Unlock ${realm.name}`,
          metadata: { type: 'unlock', realm_id: realm.id },
          onSuccess: handleUnlockRealm
        }}
      />
    </div>
  );
  const [loot, setLoot] = useState(null);
const [showReward, setShowReward] = useState(false);

const handleUnlockRealm = async () => {
  // Unlock logic
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: piUser.uid, realm_id: realm.id })
  });

  // Grant loot
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/grant-loot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: piUser.uid, realm_id: realm.id })
  });
  const data = await res.json();
  setLoot(data.granted);
  setShowReward(true);
};

}
