/**
 * Auth & Pi Payment Routes
 * Handles authentication and Pi Network payment operations.
 * Author: [Your Name or Team]
 */

const express = require('express');
const fetch = require('node-fetch');
const PiNetwork = require('pi-backend');

const router = express.Router();

// Environment Variable Validation
const apiKey = process.env.PI_API_KEY;
const walletPrivateSeed = process.env.PI_WALLET_PRIVATE_SEED;
if (!apiKey || !walletPrivateSeed) {
  throw new Error('Missing PI_API_KEY or PI_WALLET_PRIVATE_SEED environment variables.');
}

// Pi Network SDK Instance
const pi = new PiNetwork(apiKey, walletPrivateSeed);

// --- Utility Functions ---

/**
 * Standard error response helper
 */
function handleError(res, err, status = 400) {
  res.status(status).json({ error: err.message || err.toString() });
}

/**
 * Validate payment data object
 */
function validatePaymentData(data) {
  const { amount, memo, metadata, uid } = data;
  if (typeof amount !== 'number' || amount <= 0) throw new Error('Invalid amount');
  if (!memo || typeof memo !== 'string') throw new Error('Invalid memo');
  if (!metadata || typeof metadata !== 'object') throw new Error('Invalid metadata');
  if (!uid || typeof uid !== 'string') throw new Error('Invalid uid');
}

// --- Auth Route ---

router.post('/verify', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return handleError(res, new Error('Missing accessToken'), 400);

  try {
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error('Token verification failed');
    const user = await response.json();

    // Optional: Save session/user to DB here

    // Use an actual logger in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Authenticated Pi user:', user.uid);
    }

    res.json({ user });
  } catch (err) {
    handleError(res, err, 401);
  }
});

// --- Pi Payment Routes ---

router.post('/payment/a2u', async (req, res) => {
  try {
    validatePaymentData(req.body);

    const { amount, memo, metadata, uid } = req.body;
    const paymentId = await pi.createPayment({ amount, memo, metadata, uid });

    // TODO: Store paymentId in your DB for tracking

    res.status(201).json({ paymentId });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/payment/submit', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) throw new Error('Missing paymentId');
    const txid = await pi.submitPayment(paymentId);

    // TODO: Store txid in your DB with paymentId

    res.json({ txid });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) throw new Error('Missing paymentId or txid');
    const payment = await pi.completePayment(paymentId, txid);

    // TODO: Update DB with payment completion

    res.json({ payment });
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId) throw new Error('Missing paymentId param');
    const payment = await pi.getPayment(paymentId);
    if (!payment) return handleError(res, new Error('Payment not found'), 404);
    res.json({ payment });
  } catch (err) {
    handleError(res, err, 404);
  }
});

router.post('/payment/cancel', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) throw new Error('Missing paymentId');
    const payment = await pi.cancelPayment(paymentId);

    // TODO: Mark payment as cancelled in DB

    res.json({ payment });
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/payment/incomplete', async (_req, res) => {
  try {
    const payments = await pi.getIncompleteServerPayments();
    res.json({ payments });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
