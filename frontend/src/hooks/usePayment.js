// frontend/src/hooks/usePayment.js
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
      // Log error for debugging (optionally send to monitoring)
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Payment Error:', err);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [uid]);

  return { rewardStatus, rewardUser, isProcessing };
};

export default usePayment;

export function usePiPayment() {
  return async (item) => {
    window.Pi.createPayment({
      amount: item.price,
      memo: `Buy in 3D: ${item.items.name}`,
      metadata: { marketItemId: item.id },
      onReadyForServerApproval: async (pid) => {
        await fetch('/payment/submit', { method: 'POST', body: JSON.stringify({ paymentId: pid }) });
      },
      onReadyForServerCompletion: async (pid, txid) => {
        await fetch('/payment/complete', { method: 'POST', body: JSON.stringify({ paymentId: pid, txid }) });
        alert(`Purchased ${item.items.name} in-world!`);
      },
      onError: console.error,
    });
  }
}