import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // adjust if needed
  withCredentials: true, // for session cookies
});

export const piLogin = (user_uid, access_token) =>
  api.post('/pi/login', { user_uid, access_token }).then(res => res.data);

export const getBalance = () =>
  api.get('/pi/balance').then(res => res.data);

export const payPi = (recipient_uid, amount, memo) =>
  api.post('/pi/pay', { recipient_uid, amount, memo }).then(res => res.data);
