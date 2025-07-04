const express = require('express');
const axios = require('axios');
const router = express.Router();

const PI_APP_SECRET = process.env.PI_APP_SECRET;

if (!PI_APP_SECRET) {
  throw new Error('PI_APP_SECRET is not defined in environment variables.');
}

/**
 * Verifies a payment using Pi Network API.
 * @param {string} paymentId
 * @returns {Promise<Object>} Payment object from the API
 */
async function verifyPayment(paymentId) {
  const response = await axios.get(
    `https://api.minepi.com/v2/payments/${paymentId}`,
    {
      headers: { Authorization: `Key ${PI_APP_SECRET}` },
      timeout: 5000, // Prevent hanging requests
    }
  );
  return response.data;
}

router.post('/payment/complete', async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(422).json({ success: false, error: 'Invalid paymentId' });
  }

  try {
    const payment = await verifyPayment(paymentId);

    if (payment.status === 'completed') {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Payment confirmed:', payment);
      }
      // TODO: Reward the user here (DB credit, product unlock, etc.)
      return res.json({ success: true, payment });
    }
    return res.status(400).json({ success: false, error: 'Payment not completed' });
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'Verification error',
      });
    }
    console.error('Payment verification error:', error.message);
    return res.status(500).json({ success: false, error: 'Verification error' });
  }
});

module.exports = router;
