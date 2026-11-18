import CONFIG, { isBackendConfigured } from '../config';

// Pi payment flow (Pi SDK 2.0):
//   1. window.Pi.createPayment({ amount, memo, metadata }, callbacks) opens
//      the payment in Pi Browser. The SDK creates the payment — no backend
//      "create" call is needed first.
//   2. onReadyForServerApproval: the BACKEND approves the payment via the Pi
//      Platform API (POST /v2/payments/{paymentId}/approve). Until the
//      backend is connected, this step logs honestly and the payment cannot
//      complete server-side — the user is told so.
//   3. onReadyForServerCompletion: the backend completes it
//      (POST /v2/payments/{paymentId}/complete with the txid).
//
// This helper resolves with the payment result on completion and rejects on
// cancel, error, or a missing SDK. It never claims a payment succeeded when
// the backend step did not run.

export const initiatePiPayment = async ({ uid, amount, memo, metadata }) => {
  const Pi = typeof window !== 'undefined' ? window.Pi : null;
  if (!Pi) {
    throw new Error('Pi SDK not available — open this app in Pi Browser.');
  }
  if (!amount || amount <= 0) {
    throw new Error('Payment amount must be greater than zero.');
  }

  const approveOnServer = async (paymentId) => {
    if (!isBackendConfigured) {
      console.warn(
        '[Pi] No backend configured — payment %s cannot be server-approved yet. ' +
          'Connect the backend (VITE_API_BASE_URL) to complete Pi payments.',
        paymentId
      );
      throw new Error(
        'Pi payments need the backend to approve them, and no backend is connected yet.'
      );
    }
    const res = await fetch(`${CONFIG.API_BASE_URL}/payment/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, uid }),
    });
    if (!res.ok) throw new Error('Server approval failed.');
  };

  const completeOnServer = async (paymentId, txid) => {
    if (!isBackendConfigured) {
      throw new Error(
        'Pi payments need the backend to complete them, and no backend is connected yet.'
      );
    }
    const res = await fetch(`${CONFIG.API_BASE_URL}/payment/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, txid, uid }),
    });
    if (!res.ok) throw new Error('Server completion failed.');
  };

  return new Promise((resolve, reject) => {
    Pi.createPayment(
      { amount, memo, metadata: metadata || {} },
      {
        onReadyForServerApproval: (paymentId) => {
          approveOnServer(paymentId).catch(reject);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          completeOnServer(paymentId, txid)
            .then(() => resolve({ paymentId, txid }))
            .catch(reject);
        },
        onCancel: (paymentId) => {
          reject(new Error(`Payment cancelled (${paymentId}).`));
        },
        onError: (error) => {
          reject(error instanceof Error ? error : new Error('Pi payment failed.'));
        },
      }
    ).catch(reject);
  });
};
