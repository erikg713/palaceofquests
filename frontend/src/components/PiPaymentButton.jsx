// src/components/PiPaymentButton.jsx
import React from 'react';

const PiPaymentButton = ({ amount = 1, memo = "Launch Mission", metadata = {}, onPaymentComplete }) => {
  const handlePay = async () => {
    if (!window?.Pi) {
      alert('Pi SDK not available. Please open this app in the Pi Browser.');
      return;
    }

    try {
      await window.Pi.createPayment({
        amount,
        memo,
        metadata,
      }, {
        onReadyForServerApproval(paymentId) {
          console.log('✅ Ready for server approval:', paymentId);
          // TODO: send `paymentId` to your backend for server approval
        },
        onReadyForServerCompletion(paymentId, txid) {
          console.log('✅ Payment completed:', paymentId, txid);
          onPaymentComplete?.(paymentId, txid);
        },
        onCancel(paymentId) {
          console.warn('⚠️ Payment cancelled:', paymentId);
        },
        onError(error, payment) {
          console.error('❌ Payment error:', error, payment);
        },
      });
    } catch (err) {
      console.error('❌ Failed to initiate Pi payment:', err);
    }
  };

  return (
    <button
      onClick={handlePay}
      className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg"
    >
      Pay with Pi
    </button>
  );
};

export default PiPaymentButton;
