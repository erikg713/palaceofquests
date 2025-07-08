import { Request, Response, NextFunction } from 'express';
import { verifyPiToken } from '../utils/piVerifier'; // Custom utility to verify Pi tokens
import User from '../models/User'; // Mongoose or Sequelize model
import logger from '../utils/logger';

/**
 * Middleware to authenticate Pi Network users via JWT token.
 * Accepts: Authorization: Bearer <token> or x-pi-auth header.
 */
export const piAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header or x-pi-auth
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      (req.headers['x-pi-auth'] as string);

    if (!token) {
      res.status(401).json({ message: 'Missing Pi authentication token.' });
      return;
    }

    // Verify and decode the token using your custom verifier
    const piPayload = await verifyPiToken(token);

    if (!piPayload || !piPayload.uid) {
      res.status(401).json({ message: 'Invalid Pi token payload.' });
      return;
    }

    // Check if user exists in DB; if not, create a new user
    let user = await User.findOne({ uid: piPayload.uid });

    if (!user) {
      user = await User.create({
        uid: piPayload.uid,
        username: piPayload.username,
        role: 'user', // default role
        wallet: piPayload.wallet_address || null,
      });
    }

    // Attach user object to request
    (req as any).user = user;
    next();
  } catch (error) {
    logger.error('Pi authentication failed', { error });
    res.status(401).json({ message: 'Pi authentication failed.' });
  }
};
