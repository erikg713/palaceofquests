import { useState } from 'react';
import { initiatePiPayment } from '../utils/piPayment';

export default function PiPaymentModal({ userId, visible, onClose, payload }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setStatus('processing');
    setError(null);
payload={{
  amount: 5,
  memo: "Fuse Nano Sword + Plasma Shield",
  metadata: {
    type: 'fuse',
    items: ['nano_sword', 'plasma_shield']
  },
  onSuccess: async () => {
    await fetch('/fuse-items', { method: 'POST', ... })
  }
}}

    const { amount, memo, metadata, onSuccess } = payload;

    try {
      await initiatePiPayment({
        uid: userId,
        amount,
        memo,
        metadata
      });

      if (onSuccess) await onSuccess(); // call logic like unlock, grant item

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('failed');
      setError('Pi payment failed or cancelled.');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-3">💰 Pay with Pi</h2>
        <p className="mb-4">{payload.memo}</p>

        {status === 'idle' && (
          <button
            className="bg-yellow-500 text-black font-bold py-2 px-4 rounded"
            onClick={handlePayment}
          >
            Confirm & Pay {payload.amount} π
          </button>
        )}

        {status === 'processing' && <p className="text-blue-600">Processing payment...</p>}
        {status === 'success' && <p className="text-green-600">✅ Payment successful!</p>}
        {status === 'failed' && <p className="text-red-600">{error}</p>}

        <button
          className="mt-4 text-sm underline text-gray-500"
          onClick={() => {
            onClose();
            setStatus('idle');
            setError(null);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
