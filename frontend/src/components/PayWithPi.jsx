import React from 'react';

export default function PayWithPi({ user }) {
  const handlePay = async () => {
    const Pi = window.Pi;
    if (!Pi) return alert('Pi SDK not found. Use Pi Browser.');

    const paymentData = {
      amount: 0.1,
      memo: 'Buy credits',
      metadata: { userId: user.uid },
    };

    try {
      const payment = await Pi.createPayment(paymentData, async (payment) => {
        // Called when the payment is approved by user
        console.log('Payment created:', payment);

        const res = await fetch('http://localhost:5000/payment/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: payment.identifier }),
        });

        const result = await res.json();
        if (result.success) {
          alert('Payment completed!');
        } else {
          alert('Payment failed to verify.');
        }
      });
    } catch (err) {
      console.error(err);
      alert('Payment failed or was cancelled.');
    }
  };

  return (
    <button onClick={handlePay}>
      Pay 0.1π
    </button>
  );
}
