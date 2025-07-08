import fetch from 'node-fetch';

export const verifyPiUserToken = async (user, accessToken) => {
  try {
    const response = await fetch(`https://api.minepi.com/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await response.json();
    return result && result.uid === user.uid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};
