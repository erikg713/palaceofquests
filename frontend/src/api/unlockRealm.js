// src/api/unlockRealm.js
import axios from "axios";

/**
 * Unlock a realm for the user.
 * @param {string} userId - The user ID.
 * @param {string} realmId - The realm ID to unlock.
 * @returns {Promise<object>} - The response data or an error object.
 */
export const unlockRealm = async (userId, realmId) => {
  try {
    const baseURL = process.env.API_BASE_URL || "http://localhost:5000"; // Use environment variable for base URL
    const endpoint = `${baseURL}/unlock-realm`;

    const response = await axios.post(endpoint, {
      user_id: userId,
      realm_id: realmId,
    });

    // Log success or return response data
    console.log("Realm unlocked successfully:", response.data);
    return response.data;
  } catch (error) {
    // Log and return error details
    console.error(
      "Error unlocking realm:",
      error.response?.data || error.message,
    );
    throw error.response?.data || new Error("Failed to unlock realm");
  }
};
