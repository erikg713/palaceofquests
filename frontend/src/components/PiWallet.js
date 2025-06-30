import React, { useState } from "react";
import { piLogin, getBalance, payPi } from "../api/piWallet";

export default function PiWallet() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");

  // Simulate Pi login (replace with actual Pi SDK integration)
  const handleLogin = async () => {
    // You would get these from the Pi Browser SDK in production
    const user_uid = prompt("Enter Pi user UID:");
    const access_token = prompt("Enter Pi access token:");
    const res = await piLogin(user_uid, access_token);
    if (res.success) setUser(res.user);
    setMessage(res.success ? "Login successful!" : res.error);
  };

  const handleGetBalance = async () => {
    const res = await getBalance();
    if (res.success) setBalance(res.balance);
    setMessage(res.success ? "" : res.error);
  };

  const handlePay = async () => {
    const res = await payPi(recipient, amount, memo);
    setMessage(res.success ? `Payment successful: ${res.payment.txid}` : res.error);
    if (res.success) setAmount(""); // clear amount on success
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Pi Wallet</h2>
      {!user ? (
        <button onClick={handleLogin}>Login with Pi</button>
      ) : (
        <>
          <div>Welcome, {user.username}!</div>
          <button onClick={handleGetBalance}>Get Balance</button>
          {balance !== null && <div>Balance: {balance} PI</div>}
          <h3>Send Pi</h3>
          <input
            type="text"
            placeholder="Recipient UID"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Memo (optional)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
          <button onClick={handlePay}>Send</button>
        </>
      )}
      {message && <div style={{ marginTop: 10, color: "tomato" }}>{message}</div>}
    </div>
  );
}
