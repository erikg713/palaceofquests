/**
 * Handles authentication with the Pi Network SDK.
 * Checks for SDK availability, requests authentication, and returns normalized user data.
 *
 * @param {string[]} scopes - Pi Network permissions to request.
 * @returns {Promise<{ user: { uid: string, username: string } }>}
 * @throws {Error} If Pi SDK is unavailable or authentication fails.
 */
export async function authenticateWithPi(scopes = ['username', 'payments']) {
  if (typeof window === 'undefined' || !window.Pi?.authenticate) {
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
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[PiAuth] Authentication error:', error);
    }
    throw new Error('Authentication failed. Please try again.');
  }
}
