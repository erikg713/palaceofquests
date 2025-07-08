const { verifyPiTokenWithAPI } = require('../utils/verifyPiToken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate Pi Network users by verifying their access token via the Pi API.
 * Accepts token via Authorization: Bearer <token> or x-pi-auth header.
 */
const piAuthMiddleware = async (req, res, next) => {
  try {
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.headers['x-pi-auth'];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Pi token missing' });
    }

    const piUser = await verifyPiTokenWithAPI(token);

    if (!piUser || !piUser.uid) {
      return res.status(401).json({ message: 'Invalid Pi token or user not found' });
    }

    // Look up user in DB, or create a new one if not found
    let user = await User.findOne({ uid: piUser.uid });
    if (!user) {
      user = await User.create({
        uid: piUser.uid,
        username: piUser.username,
        wallet: piUser.wallet_address || null,
        role: 'user', // default role
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Pi Network auth failed', { error });
    res.status(401).json({ message: 'Pi authentication failed.' });
  }
};

module.exports = piAuthMiddleware;
