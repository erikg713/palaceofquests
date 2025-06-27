Pi.createPayment({
  amount: 0.5,
  memo: "Buying Healing Potion",
  metadata: { itemId: "abc123" },
  onReadyForServerApproval(paymentId) {
    // Send to backend for approval
    fetch("/api/payment/submit", {
      method: "POST",
      body: JSON.stringify({ paymentId }),
    });
  },
  onReadyForServerCompletion(paymentId, txid) {
    // Tell backend to finalize
    fetch("/api/payment/complete", {
      method: "POST",
      body: JSON.stringify({ paymentId, txid }),
    });
  },
  onCancel(paymentId) {
    console.log("Payment cancelled", paymentId);
  },
  onError(error, paymentId) {
    console.error("Payment error", error);
  },
});
