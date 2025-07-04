// backend/utils/verifyPiToken.js

const axios = require('axios');
const pino = require('pino');
const jwt = require('jsonwebtoken');

// Logger setup
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 30;
const rateLimitMap = new Map();

function isRateLimited(token) {
  const now = Date.now();
  const entry = rateLimitMap.get(token) || { count: 0, start: now };
  if (now - entry.start > rateLimitWindowMs) {
    rateLimitMap.set(token, { count: 1, start: now });
    return false;
  }
  if (entry.count >= maxRequestsPerWindow) return true;
  entry.count += 1;
  rateLimitMap.set(token, entry);
  return false;
}

// Fetch and cache Pi Network public key for JWT verification
let cachedKey = null;
async function getPiPublicKey() {
  if (cachedKey) return cachedKey;
  const res = await axios.get('https://api.minepi.com/pi/users/public_key');
  cachedKey = res.data;
  return cachedKey;
}

/**
 * Verify Pi Network access token via API (returns user profile on success)
 * @param {string} accessToken - Pi Network access token (Bearer JWT from client)
 * @returns {Promise<Object>} - User profile object
 */
async function verifyPiTokenWithAPI(accessToken) {
  if (!accessToken) {
    logger.warn('verifyPiTokenWithAPI called without accessToken');
    throw new Error('No access token provided.');
  }
  if (isRateLimited(accessToken)) {
    logger.warn({ token: accessToken }, 'Rate limit exceeded for token');
    throw new Error('Too many verification requests. Please try again later.');
  }
  try {
    logger.info('Verifying Pi token via Pi Network API');
    const response = await axios.get('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 4000
    });
    if (response.data && response.data.uid) {
      logger.info({ uid: response.data.uid }, 'Pi token verified successfully');
      return response.data;
    } else {
      logger.error({ data: response.data }, 'Unexpected response from Pi Network');
      throw new Error('Invalid Pi access token or malformed Pi Network response.');
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      logger.warn('Unauthorized: Invalid or expired Pi access token');
      throw new Error('Unauthorized: Invalid or expired Pi access token.');
    } else if (err.code === 'ECONNABORTED') {
      logger.error('Pi Network API request timed out');
      throw new Error('Pi Network API timeout. Please try again.');
    } else {
      logger.error({ error: err.message }, 'Error verifying Pi token');
      throw new Error('Pi Network verification failed: ' + err.message);
    }
  }
}

/**
 * Verify Pi Network access token as JWT (returns decoded payload on success)
 * @param {string} token - Pi Network JWT
 * @returns {Promise<Object>} - Decoded JWT payload
 */
async function verifyPiTokenJWT(token) {
  if (!token) {
    logger.warn('verifyPiTokenJWT called without token');
    throw new Error('No token provided.');
  }
  const publicKey = await getPiPublicKey();
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['ES256'] });
    logger.info({ uid: decoded.uid }, 'Pi JWT verified successfully');
    return decoded;
  } catch (err) {
    logger.error({ error: err.message }, 'JWT verification failed');
    throw new Error('Invalid or expired Pi JWT: ' + err.message);
  }
}

// Export both methods for flexibility
module.exports = {
  verifyPiTokenWithAPI,
  verifyPiTokenJWT
};
