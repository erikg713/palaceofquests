// src/api/paymentService.js
const BASE_URL = 'http://localhost:5000/payment'; // change to your actual backend URL

export const createA2UPayment = async (data) => {
  const res = await fetch(`${BASE_URL}/a2u`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const submitPayment = async (paymentId) => {
  const res = await fetch(`${BASE_URL}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const completePayment = async (paymentId, txid) => {
  const res = await fetch(`${BASE_URL}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, txid })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
