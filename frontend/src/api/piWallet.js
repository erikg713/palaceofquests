import axios from 'axios';

// Axios instance with environment-specific base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    withCredentials: true,
});

/**
 * Logs in a user using their UID and access token.
 * @param {string} user_uid - The user's unique identifier.
 * @param {string} access_token - The user's access token.
 * @returns {Promise<Object>} - The server's response data.
 */
export const piLogin = async (user_uid, access_token) => {
    try {
        const response = await api.post('/pi/login', { user_uid, access_token });
        return response.data;
    } catch (error) {
        console.error('piLogin Error:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Retrieves the balance of the current user.
 * @returns {Promise<Object>} - The balance information.
 */
export const getBalance = async () => {
    try {
        const response = await api.get('/pi/balance');
        return response.data;
    } catch (error) {
        console.error('getBalance Error:', error);
        throw error.response?.data || error.message;
    }
};

/**
 * Sends payment to a recipient.
 * @param {string} recipient_uid - The recipient's unique identifier.
 * @param {number} amount - The amount to send.
 * @param {string} memo - An optional memo for the transaction.
 * @returns {Promise<Object>} - The server's response data.
 */
export const payPi = async (recipient_uid, amount, memo) => {
    if (!recipient_uid || !amount || typeof amount !== 'number' || amount <= 0) {
        throw new Error('Invalid recipient_uid or amount');
    }
    try {
        const response = await api.post('/pi/pay', { recipient_uid, amount, memo });
        return response.data;
    } catch (error) {
        console.error('payPi Error:', error);
        throw error.response?.data || error.message;
    }
};
