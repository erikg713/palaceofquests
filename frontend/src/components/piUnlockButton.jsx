import { useState } from "react";
import { initiatePiPayment } from "../utils/piPayment";

export default function PiUnlockButton({ userId, realm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      await initiatePiPayment({
        uid: userId,
        amount: realm.unlockCost,
        memo: `Unlock ${realm.name}`,
        metadata: { type: "unlock", realm_id: realm.id },
      });

      // Now unlock in Supabase
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/unlock-realm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, realm_id: realm.id }),
      });

      alert(`${realm.name} unlocked!`);
    } catch (err) {
      console.error(err);
      setError("Payment failed or cancelled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-bold"
      onClick={handlePay}
      disabled={loading}
    >
      {loading
        ? "Processing..."
        : `Unlock ${realm.name} for ${realm.unlockCost} π`}
    </button>
  );
}
