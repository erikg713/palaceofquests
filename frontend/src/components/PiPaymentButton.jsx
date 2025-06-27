// src/components/PiPaymentButton.jsx import React from 'react';
import { useUserInventory } from "../hooks/useUserInventory";

const { addItem } = useUserInventory(userId); // userId must come from Supabase Auth

<PiPaymentButton
  amount={1}
  memo={`Buy ${item.name}`}
  metadata={{ itemId: item.id, type: "purchase" }}
  onPaymentComplete={() => {
    alert(`${item.name} purchased with Pi!`);
    onEquip(item);
    addItem({
      id: item.id,
      name: item.name,
      rarity: item.rarity,
      icon: item.icon,
    });
  }}
/>;

const PiPaymentButton = ({
  amount = 1,
  memo = "Launch Mission",
  metadata = {},
  onPaymentComplete,
}) => {
  const handlePay = async () => {
    if (!window?.Pi) {
      alert("Pi SDK not available. Please open this app in the Pi Browser.");
      return;
    }

    try {
      await window.Pi.createPayment(
        {
          amount,
          memo,
          metadata,
        },
        {
          onReadyForServerApproval(paymentId) {
            console.log("Payment ID ready for server approval:", paymentId);
            // send paymentId to your backend for server-side approval
          },
          onReadyForServerCompletion(paymentId, txid) {
            console.log("Payment completed:", paymentId, txid);
            onPaymentComplete?.(paymentId, txid);
          },
          onCancel(paymentId) {
            console.warn("Payment cancelled:", paymentId);
          },
          onError(error, payment) {
            console.error("Payment error:", error, payment);
          },
        },
      );
    } catch (err) {
      console.error("Failed to start Pi payment:", err);
    }
  };

  return (
    <button
      onClick={handlePay}
      className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg"
    >
      {" "}
      Pay with Pi{" "}
    </button>
  );
};

export default PiPaymentButton;

// Update WorldHub.jsx to use PiPaymentButton // (add this line at the top) import PiPaymentButton from '../components/PiPaymentButton';

// Add inside the WorldHub return JSX below the teleport buttons: {/* Pi payment for Launch Access */} <PiPaymentButton amount={1} memo="Launch Protocol Alpha" metadata={{ realm: 'Moon Fortress', type: 'launch' }} onPaymentComplete={() => alert('Launch fee paid. Teleport unlocked!')} />

// Optional: include Pi SDK script tag in your index.html or load it via Pi Browser runtime
