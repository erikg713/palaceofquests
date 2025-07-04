// frontend/src/auth/piAuth.js

/**
 * Handles user authentication using the Pi Network SDK.
 * Validates SDK presence, requests authentication with given scopes,
 * and returns a normalized user object.
 *
 * @param {string[]} scopes - Permissions to request from the Pi Network SDK.
 * @returns {Promise<{ user: { uid: string, username: string } }>}
 * @throws {Error} If SDK is unavailable or authentication fails.
 */
export async function authenticateWithPi(scopes = ['username', 'payments']) {
  if (typeof window === 'undefined' || !window.Pi || typeof window.Pi.authenticate !== 'function') {
    throw new Error('Pi Network SDK is not available in this environment.');
  }

  try {
    const authResult = await window.Pi.authenticate(scopes, () => {});
    const { user } = authResult || {};

    if (!user || typeof user.uid !== 'string' || typeof user.username !== 'string') {
      throw new Error('Received invalid user data from Pi authentication.');
    }

    return { user: { uid: user.uid, username: user.username } };
  } catch (error) {
    // Only log detailed error info in development for security
    if (process.env.NODE_ENV !== 'production') {
      console.error('[PiAuth] Authentication error:', error);
    }
    throw new Error('Authentication failed. Please try again.');
  }
}
