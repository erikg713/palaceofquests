import React, { useState, useContext, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentModal from '../components/PiPaymentModal';
import RewardModal from '../components/RewardModal';
import PiPaymentButton from '../components/PiPaymentButton';

const REALM = { id: 'moon_fortress', name: 'Moon Fortress', unlockCost: 2 };

export default function WorldHub() {
  const { player } = usePlayer();
  const { walletAddress, piUser } = useContext(PiWalletContext);

  const [state, setState] = useState({
    showPayModal: false,
    showReward: false,
    loot: null,
    loading: false,
    error: '',
  });

  const handleUnlockRealm = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const [unlockRes, lootRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, { ... }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/grant-loot`, { ... }),
      ]);
      const lootData = await lootRes.json();
      setState((prev) => ({
        ...prev,
        loot: lootData.granted || null,
        showReward: true,
        showPayModal: false,
      }));
    } catch {
      setState((prev) => ({ ...prev, error: 'Failed to unlock the realm. Please try again.' }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [piUser]);
  
  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">...</div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center py-12">...</div>
  );
}
