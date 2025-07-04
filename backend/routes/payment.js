const express = require('express');
const axios = require('axios');
const router = express.Router();

const APP_ACCESS_TOKEN = process.env.PI_APP_SECRET; // From dev portal

if (!APP_ACCESS_TOKEN) {
  throw new Error('APP_ACCESS_TOKEN is not defined in environment variables.');
}

async function verifyPayment(paymentId) {
  const response = await axios.get(
    `https://api.minepi.com/v2/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Key ${APP_ACCESS_TOKEN}`,
      },
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
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Payment not completed' });
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return res.status(500).json({ success: false, error: 'Verification error' });
  }
});

module.exports = router;
