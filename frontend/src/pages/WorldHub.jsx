import React, { useState, useContext, useCallback, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentModal from '../components/PiPaymentModal';
import RewardModal from '../components/RewardModal';
import PiPaymentButton from '../components/PiPaymentButton';

const REALM = { id: 'moon_fortress', name: 'Moon Fortress', unlockCost: 2 };

export default function WorldHub() {
  const { player } = usePlayer();
  const { walletAddress, piUser } = useContext(PiWalletContext);

  const [showPayModal, setShowPayModal] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [loot, setLoot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = useMemo(() => import.meta.env.VITE_API_BASE_URL, []);
  const unlockUrl = useMemo(() => `${API_BASE}/unlock-realm`, [API_BASE]);
  const lootUrl = useMemo(() => `${API_BASE}/grant-loot`, [API_BASE]);
  const fetchOptions = useMemo(() => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: piUser, realm: REALM.id })
  }), [piUser]);

  const handleUnlockRealm = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [unlockRes, lootRes] = await Promise.all([
        fetch(unlockUrl, fetchOptions),
        fetch(lootUrl, fetchOptions)
      ]);

      if (!unlockRes.ok) throw new Error('Unlock failed');
      if (!lootRes.ok) throw new Error('Loot grant failed');
      const lootData = await lootRes.json();
      setLoot(lootData.granted || null);
      setShowReward(true);
      setShowPayModal(false);
    } catch (err) {
      setError(
        typeof err?.message === 'string'
          ? err.message
          : 'Failed to unlock the realm. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [unlockUrl, lootUrl, fetchOptions]);

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {/* Wallet connection UI here */}
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center py-12">
      {/* Main WorldHub UI goes here */}
      {/* Use showPayModal, showReward, loot, loading, error as needed */}
    </div>
  );
}
