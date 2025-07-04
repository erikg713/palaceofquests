import React, { useState, useContext, useCallback, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentModal from '../components/PiPaymentModal';
import RewardModal from '../components/RewardModal';
import PiPaymentButton from '../components/PiPaymentButton';

const REALM = {
  id: 'moon_fortress',
  name: 'Moon Fortress',
  unlockCost: 2,
};

const WorldHub = () => {
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

  const fetchOptions = useMemo(
    () => ({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: piUser, realm: REALM.id }),
    }),
    [piUser]
  );

  const handleUnlockRealm = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [unlockRes, lootRes] = await Promise.all([
        fetch(unlockUrl, fetchOptions),
        fetch(lootUrl, fetchOptions),
      ]);
      if (!unlockRes.ok) throw new Error('Failed to unlock this realm.');
      if (!lootRes.ok) throw new Error('Could not grant loot.');
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

  // UI: If wallet is not connected
  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">Wallet Not Connected</h2>
          <p className="mb-6 text-gray-700">
            Connect your Pi Wallet to explore and unlock new realms in the Palace of Quests metaverse.
          </p>
          <PiPaymentButton />
        </div>
      </div>
    );
  }

  // UI: Main World Hub
  return (
    <div className="min-h-[70vh] flex flex-col items-center py-12 bg-gradient-to-b from-gray-100 to-indigo-100">
      <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-xl transition-all">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2 text-center">
          Welcome, {player?.username || 'Explorer'}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Ready to unlock the secrets of the <span className="font-semibold">{REALM.name}</span>?
        </p>

        <div className="flex flex-col items-center gap-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-indigo-700">{REALM.name}</h2>
              <p className="text-gray-500">Realm Unlock Cost: <span className="font-bold">{REALM.unlockCost} Pi</span></p>
            </div>
            <button
              onClick={() => setShowPayModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Unlocking...' : `Unlock ${REALM.name}`}
            </button>
          </div>
          {error && (
            <div className="w-full text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <PiPaymentModal
          onClose={() => setShowPayModal(false)}
          onConfirm={handleUnlockRealm}
          realm={REALM}
          loading={loading}
        />
      )}

      {/* Reward Modal */}
      {showReward && (
        <RewardModal
          loot={loot}
          onClose={() => setShowReward(false)}
        />
      )}
    </div>
  );
};

export default WorldHub;
