import axios from 'axios';

export const verifyPiToken = async (token) => {
  try {
    const response = await axios.post(
      'https://api.minepi.com/v2/me',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error('Pi token verification failed:', err.response?.data || err.message);
    return null;
  }
};


// utils/piVerification.js
import fetch from 'node-fetch';

export async function verifyPiAuth(user, accessToken) {
  try {
    const response = await fetch('https://api.minepi.com/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data.uid === user.uid; // Must match exactly
  } catch (err) {
    console.error('Pi verification failed:', err);
    return false;
  }
}
