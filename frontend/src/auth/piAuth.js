// frontend/src/auth/piAuth.js

/**
 * Handles authentication with the Pi Network SDK.
 * Returns the authenticated user's UID and username.
 * Throws a descriptive error if authentication fails or SDK is unavailable.
 *
 * @param {string[]} scopes - The list of permissions required for authentication.
 * @returns {Promise<{ user: { uid: string, username: string } }>}
 */
export async function authenticateWithPi(scopes = ['username', 'payments']) {
  if (typeof window === 'undefined' || !window.Pi) {
    throw new Error('Pi Network SDK is not available in the current environment.');
  }

  try {
    const authResult = await window.Pi.authenticate(scopes, () => {});
    const user = authResult?.user;
    if (!user?.uid || !user?.username) {
      throw new Error('Invalid response from Pi authentication.');
    }
    return { user: { uid: user.uid, username: user.username } };
  } catch (err) {
    // Log for diagnostics, but only expose generic error to caller
    // (Do not leak sensitive info to UI)
    console.error('[PiAuth] Authentication error:', err);
    throw new Error('Authentication failed. Please try again.');
  }
}
