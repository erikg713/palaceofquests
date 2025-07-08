const { verifyPiTokenWithAPI } = require('../utils/verifyPiToken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Hardened Pi Network auth middleware.
 * Verifies token against Pi API and manages user provisioning.
 */
const piAuthMiddleware = async (req, res, next) => {
  try {
    const rawAuthHeader = req.headers['authorization'];
    const fallbackHeader = req.headers['x-pi-auth'];

    // Extract token from headers
    let token = null;
    if (rawAuthHeader && rawAuthHeader.startsWith('Bearer ')) {
      token = rawAuthHeader.split(' ')[1];
    } else if (typeof fallbackHeader === 'string') {
      token = fallbackHeader;
    }

    if (!token) {
      logger.warn('Missing Pi token');
      return res.status(401).json({ message: 'Unauthorized: No Pi token provided.' });
    }

    // Verify token with Pi API
    const piUser = await verifyPiTokenWithAPI(token);

    if (!piUser || !piUser.uid) {
      logger.warn('Invalid or expired Pi token');
      return res.status(401).json({ message: 'Unauthorized: Invalid Pi token' });
    }

    // Provision user from DB or create if needed
    let user = await User.findOne({ uid: piUser.uid });
    if (!user) {
      user = await User.create({
        uid: piUser.uid,
        username: piUser.username,
        wallet: piUser.wallet_address || null,
        role: 'user', // Default role
        createdAt: new Date(),
      });
      logger.info({ uid: user.uid }, 'User created via Pi auth');
    }

    // Attach full user to request object
    req.user = user;
    next();
  } catch (err) {
    logger.error('Pi auth failed', { error: err.message || err });
    return res.status(401).json({ message: 'Pi authentication failed. Please log in again.' });
  }
};

module.exports = piAuthMiddleware;

