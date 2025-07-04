const jwt = require('jsonwebtoken');
const axios = require('axios');

let cachedPublicKey = null;

async function getPiPublicKey() {
  if (cachedPublicKey) return cachedPublicKey;

  const res = await axios.get('https://api.minepi.com/pi/users/public_key');
  cachedPublicKey = res.data;
  return cachedPublicKey;
}

module.exports = async function verifyPiToken(accessToken) {
  const publicKey = await getPiPublicKey();

  try {
    const decoded = jwt.verify(accessToken, publicKey, {
      algorithms: ['ES256'],
    });

    return decoded; // Contains: uid, username, user_wallet_address
  } catch (err) {
    throw new Error('Invalid access token');
  }
};

