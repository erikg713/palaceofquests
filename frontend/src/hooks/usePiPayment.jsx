// frontend/src/hooks/usePiPayment.jsx
import { useState, useCallback } from 'react';
import { createA2UPayment, submitPayment, completePayment } from '../api/paymentService';

const usePayment = (uid) => {
  const [rewardStatus, setRewardStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const rewardUser = useCallback(async () => {
    setIsProcessing(true);
    try {
      setRewardStatus('Creating reward...');
      const { paymentId } = await createA2UPayment({
        amount: 1,
        memo: 'Quest reward for Dragon Battle',
        metadata: { questId: 'dragon01' },
        uid,
      });

      setRewardStatus('Submitting to Pi chain...');
      const { txid } = await submitPayment(paymentId);

      setRewardStatus('Completing payment...');
      const result = await completePayment(paymentId, txid);

      setRewardStatus(`✅ Reward sent: ${result.payment.amount} Pi`);
    } catch (err) {
      setRewardStatus(`❌ Error: ${err.message || 'Unexpected error.'}`);
      if (import.meta.env.DEV) {
        console.error('Payment Error:', err);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [uid]);

  return { rewardStatus, rewardUser, isProcessing };
};

export default usePayment;

// Buy an item in-world with Pi. Uses the real Pi SDK 2.0 shape:
// createPayment({ amount, memo, metadata }, callbacks).
export function usePiPayment() {
  return async (item) => {
    const Pi = typeof window !== 'undefined' ? window.Pi : null;
    if (!Pi) {
      throw new Error('Pi SDK not available — open this app in Pi Browser.');
    }
    const name = item?.items?.name || item?.name || 'item';
    await Pi.createPayment(
      {
        amount: item.price,
        memo: `Buy in 3D: ${name}`,
        metadata: { marketItemId: item.id },
      },
      {
        onReadyForServerApproval: async (pid) => {
          await fetch('/payment/submit', {
            method: 'POST',
            body: JSON.stringify({ paymentId: pid }),
          });
        },
        onReadyForServerCompletion: async (pid, txid) => {
          await fetch('/payment/complete', {
            method: 'POST',
            body: JSON.stringify({ paymentId: pid, txid }),
          });
          alert(`Purchased ${name} in-world!`);
        },
        onCancel: (pid) => {
          console.warn('Payment cancelled:', pid);
        },
        onError: (err) => {
          console.error('Pi payment error:', err);
        },
      }
    );
  };
}
