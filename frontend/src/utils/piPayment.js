import CONFIG from "../config";

export const initiatePiPayment = async ({ uid, amount, memo, metadata }) => {
  // Step 1: Request backend to create payment on Pi Network
  const res = await fetch(`${CONFIG.API_BASE_URL}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, amount, memo, metadata }),
  });

  const payment = await res.json();

  if (!payment || !payment.identifier) {
    throw new Error("Failed to initiate Pi payment");
  }

  // Step 2: Trigger Pi SDK payment flow
  const Pi = window.Pi;
  if (!Pi) throw new Error("Pi SDK not available – are you in Pi Browser?");

  return Pi.createPayment(payment.identifier, async (paymentData) => {
    // Step 3: Approve payment
    await fetch(`${CONFIG.API_BASE_URL}/payment/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: payment.identifier }),
    });

    // Step 4: Complete payment
    await fetch(`${CONFIG.API_BASE_URL}/payment/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: payment.identifier,
        txid: paymentData.transaction.txid,
      }),
    });

    return paymentData;
  });
};
