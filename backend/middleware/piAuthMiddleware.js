import { Request, Response, NextFunction } from 'express';
import { verifyPiToken } from '../utils/piVerifier'; // Verifies token using Pi SDK (your utility)
import User from '../models/User';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

/**
 * Middleware to verify Pi Network JWT from frontend authentication
 * Expects a valid token in Authorization header as: Bearer <token>
 */
export const piAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Replace with your actual Pi App Secret
    const PI_APP_SECRET = process.env.PI_APP_SECRET;

    if (!PI_APP_SECRET) {
      throw new Error('Pi App secret is not configured.');
    }

    // Verify and decode the JWT token from Pi Network SDK
    const decoded = jwt.verify(token, PI_APP_SECRET, { algorithms: ['HS256'] });

    // Attach user to request object
    req.user = {
      uid: decoded.uid,
      username: decoded.user?.username,
      roles: decoded.metadata?.roles || [], // Optional: if you're assigning custom roles
    };

    next();
  } catch (err) {
    console.error('Pi auth failed:', err.message);
    return res.status(403).json({ message: 'Unauthorized: Invalid or expired Pi token' });
  }
};

export const piAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Allow for flexibility in how token is sent
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.headers['x-pi-auth'];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Pi token missing' });
    }

    // Verify token using your Pi verifier utility
    const piPayload = await verifyPiToken(token);
    if (!piPayload || !piPayload.uid) {
      return res.status(401).json({ message: 'Invalid Pi token' });
    }

    // Check if user exists in DB, otherwise create one
    let user = await User.findOne({ uid: piPayload.uid });
    if (!user) {
      user = await User.create({
        uid: piPayload.uid,
        username: piPayload.username,
        role: 'user', // default role
        wallet: piPayload.wallet_address || null,
      });
    }

    // Attach user to request for access in routes
    req.user = user;
    next();
  } catch (error) {
    logger.error('Pi authentication failed', { error });
    res.status(401).json({ message: 'Pi authentication failed' });
  }
};!piUser) {
      return res.status(401).json({ error: 'Invalid Pi Network access token.' });
    }

    req.user = piUser; // Attach the verified Pi user info
    next();
  } catch (error) {
    logger.error('Pi Network auth failed', { error });
    res.status(401).json({ error: 'Pi Network authentication failed.' });
  }
};
export const piAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['x-pi-auth'];
    if (!token) return res.status(401).json({ message: 'Pi token missing' });

    const userPayload = await verifyPiToken(token);
    if (!userPayload || !userPayload.uid) {
      return res.status(401).json({ message: 'Invalid Pi token' });
    }

    let user = await User.findOne({ uid: userPayload.uid });
    if (!user) {
      user = await User.create({
        uid: userPayload.uid,
        username: userPayload.username,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(401).json({ message: 'Pi authentication failed' });
  }
};
