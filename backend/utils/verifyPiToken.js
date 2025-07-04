// backend/utils/verifyPiToken.js

const axios = require('axios');
const pino = require('pino');

// Create a logger instance
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Simple in-memory rate limiter per IP/token (production: use Redis or similar)
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 30;
const rateLimitMap = new Map();

/**
 * Returns true if the token has exceeded its rate limit.
 */
function isRateLimited(token) {
  const now = Date.now();
  const entry = rateLimitMap.get(token) || { count: 0, start: now };
  if (now - entry.start > rateLimitWindowMs) {
    // Reset window
    rateLimitMap.set(token, { count: 1, start: now });
    return false;
  }
  if (entry.count >= maxRequestsPerWindow) return true;
  entry.count += 1;
  rateLimitMap.set(token, entry);
  return false;
}

/**
 * Verifies a Pi Network access token via the official API.
 * Logs actions, rate limits requests, and provides detailed error handling.
 * @param {string} accessToken - Pi Network access token (Bearer JWT from client).
 * @returns {Promise<Object>} - User profile object from Pi Network if valid.
 * @throws {Error} - If rate limited, invalid, or on network error.
 */
async function verifyPiToken(accessToken) {
  if (!accessToken) {
    logger.warn('verifyPiToken called without accessToken');
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
const jwt = require('jsonwebtoken');
const axios = require('axios');

let cachedKey = null;

async function getPiPublicKey() {
  if (cachedKey) return cachedKey;
  const res = await axios.get('https://api.minepi.com/pi/users/public_key');
  cachedKey = res.data;
  return cachedKey;
}

module.exports = async function verifyPiToken(token) {
  const publicKey = await getPiPublicKey();
  return jwt.verify(token, publicKey, { algorithms: ['ES256'] });
};

module.exports = verifyPiToken;
