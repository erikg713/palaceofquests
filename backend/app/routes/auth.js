const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/verify', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'Missing accessToken' });

  try {
    // Verify token with Pi Network
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error('Token verification failed');
    const user = await response.json();

    // Optionally save session or user to DB
    console.log('Authenticated Pi user:', user.uid);

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const PiNetwork = require('pi-backend');

// Load credentials securely (use env variables, never hardcode secrets)
const apiKey = process.env.PI_API_KEY;
const walletPrivateSeed = process.env.PI_WALLET_PRIVATE_SEED;
const pi = new PiNetwork(apiKey, walletPrivateSeed);

// Util: Validate inputs
const validatePaymentData = (data) => {
  const { amount, memo, metadata, uid } = data;
  if (typeof amount !== 'number' || amount <= 0) throw new Error('Invalid amount');
  if (!memo || typeof memo !== 'string') throw new Error('Invalid memo');
  if (!metadata || typeof metadata !== 'object') throw new Error('Invalid metadata');
  if (!uid || typeof uid !== 'string') throw new Error('Invalid uid');
};

// Create A2U payment route
router.post('/payment/a2u', async (req, res) => {
  try {
    validatePaymentData(req.body);

    const { amount, memo, metadata, uid } = req.body;
    const paymentId = await pi.createPayment({ amount, memo, metadata, uid });

    // Store paymentId in your DB here for tracking

    res.status(201).json({ paymentId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit payment to Pi Blockchain
router.post('/payment/submit', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) throw new Error('Missing paymentId');
    const txid = await pi.submitPayment(paymentId);

    // Store txid in your DB along with paymentId

    res.json({ txid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Complete the payment
router.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) throw new Error('Missing paymentId or txid');
    const payment = await pi.completePayment(paymentId, txid);

    // Optionally update your DB with payment completion

    res.json({ payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await pi.getPayment(paymentId);
    res.json({ payment });
  } catch (err) {
    res.status(404).json({ error: 'Payment not found' });
  }
});

// Cancel a payment
router.post('/payment/cancel', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) throw new Error('Missing paymentId');
    const payment = await pi.cancelPayment(paymentId);

    // Update DB as cancelled

    res.json({ payment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get incomplete payments for troubleshooting
router.get('/payment/incomplete', async (req, res) => {
  try {
    const payments = await pi.getIncompleteServerPayments();
    res.json({ payments });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
