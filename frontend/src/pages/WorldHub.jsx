import React, { useState, useContext, useCallback } from "react";
import { PiWalletContext } from "../context/PiWalletContext";
import PiPaymentModal from "../components/PiPaymentModal";
import RewardModal from "../components/RewardModal";

const REALM = {
  id: "moon_fortress",
  name: "Moon Fortress",
  unlockCost: 2,
};

export default function WorldHub() {
  const { walletAddress, piUser } = useContext(PiWalletContext);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [loot, setLoot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlockRealm = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: piUser?.uid,
          realm_id: REALM.id,
        }),
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/grant-loot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: piUser?.uid,
            realm_id: REALM.id,
          }),
        },
      );

      const data = await res.json();
      setLoot(data.granted || null);
      setShowReward(true);
      setShowPayModal(false);
    } catch {
      setError("Failed to unlock the realm. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [piUser]);

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-white/10 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Connect Pi Wallet
          </h2>
          <p className="text-gray-200">
            Please connect your Pi Wallet to access the World Hub.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="w-full max-w-xl bg-white/10 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-yellow-300 mb-4 flex items-center gap-2">
          <span>Welcome to the World Hub</span>
          <span role="img" aria-label="globe">
            🌍
          </span>
        </h1>
        <div className="mb-6">
          <p className="text-lg text-white">
            <span className="font-semibold text-yellow-200">Realm:</span>{" "}
            {REALM.name}
          </p>
        </div>
        <button
          className={`w-full py-3 rounded-lg font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 shadow-md transition hover:scale-105 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={() => setShowPayModal(true)}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : `Unlock ${REALM.name} for ${REALM.unlockCost} π`}
        </button>
        {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
      </div>
      <PiPaymentModal
        visible={showPayModal}
        onClose={() => setShowPayModal(false)}
        userId={piUser?.uid}
        payload={{
          amount: REALM.unlockCost,
          memo: `Unlock ${REALM.name}`,
          metadata: { type: "unlock", realm_id: REALM.id },
          onSuccess: handleUnlockRealm,
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
