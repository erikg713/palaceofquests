const express = require('express');
const axios = require('axios');
const router = express.Router();

const APP_ACCESS_TOKEN = process.env.PI_APP_SECRET; // From dev portal

router.post('/payment/complete', async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.get(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Key ${APP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = response.data;

    if (payment.status === 'completed') {
      // ✅ Payment is confirmed
      // TODO: Grant reward, update DB, etc.
      console.log('Payment confirmed:', payment);
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Not completed' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error.message);
    return res.status(500).json({ success: false, error: 'Verification error' });
  }
});

module.exports = router;
