import React, { useState } from 'react';
import PiPaymentModal from './PiPaymentModal';

export default function FuseItemsModal({ userId, selectedItems, onClose }) {
  const [showPayment, setShowPayment] = useState(false);
  const [fusionResult, setFusionResult] = useState(null);

  const handleFusion = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fuse-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        item_ids: selectedItems.map(i => i.id)
      })
    });
    const data = await res.json();
    setFusionResult(data.result);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-md shadow-xl">
          <h2 className="text-xl font-bold mb-4">⚡ Fuse Items</h2>
          <ul className="mb-4">
            {selectedItems.map(item => (
              <li key={item.id}>{item.item_name}</li>
            ))}
          </ul>

          <button
            className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
            onClick={() => setShowPayment(true)}
          >
            Pay 3 π to Fuse
          </button>

          <button
            className="mt-3 text-sm text-gray-500 underline"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>

      <PiPaymentModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        userId={userId}
        payload={{
          amount: 3,
          memo: 'Fuse rare items',
          metadata: { type: 'fuse', item_ids: selectedItems.map(i => i.id) },
          onSuccess: handleFusion
        }}
      />
    </>
  );
}
