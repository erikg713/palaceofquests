/**
 * Verify Pi Network Access Token using only Pi Network official endpoints.
 * No JWT libraries are used.
 * Returns user profile data if valid, throws error if invalid.
 */

const axios = require('axios');

/**
 * Verifies a Pi Network access token by querying the official Pi verification endpoint.
 * @param {string} accessToken - The Pi Network access token to verify.
 * @returns {Promise<Object>} The Pi user object (uid, username, wallet, etc.) if valid.
 * @throws {Error} If the access token is invalid or request fails.
 */
async function verifyPiToken(accessToken) {
  if (!accessToken) throw new Error('No access token provided.');

  try {
    // Per Pi Network docs: token is sent as Bearer in Authorization header
    const res = await axios.get('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Expecting user profile object on success
    if (res.data && res.data.uid) {
      return res.data;
    } else {
      throw new Error('Invalid Pi access token or missing user data.');
    }
  } catch (err) {
    // Handle network and Pi API errors gracefully
    if (err.response && err.response.status === 401) {
      throw new Error('Unauthorized: Invalid or expired Pi access token.');
    }
    throw new Error(`Pi Network verification failed: ${err.message}`);
  }
}

module.exports = verifyPiToken;
