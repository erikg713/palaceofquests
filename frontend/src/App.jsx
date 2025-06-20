import React, { useState, useCallback, memo } from 'react';
import './App.css';
// src/App.jsx
import { useState, useEffect } from 'react';
import QuestLog from './components/QuestLog';
import { authenticateWithPi } from './auth/piAuth';

export default function App() {
  const [user, setUser] = useState(null);

  const login = async () => {
    const auth = await authenticateWithPi();
    setUser(auth.user);
  };

  return (
    <div className="App">
      <h1>Palace of Quests</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <QuestLog uid={user.uid} />
        </>
      ) : (
        <button onClick={login}>Login with Pi Wallet</button>
      )}
    </div>
  );
}

// Custom hook for Pi authentication and payment
function usePiAuth() {
  const [user, setUser] = useState(null);

  const loginWithPi = useCallback(async () => {
    try {
      const scopes = ['username', 'payments'];
      const auth = await window.Pi.authenticate(scopes, (payment) => {
        console.log('Incomplete payment found:', payment);
      });
      setUser(auth.user);
      console.log('Logged in as:', auth.user.username);
    } catch (err) {
      console.error('Login error:', err);
    }
  }, []);

  const unlockQuest = useCallback(() => {
    window.Pi.createPayment(
      {
        amount: 5,
        memo: 'Unlock Dragon Quest',
        metadata: { questId: 'dragon01' },
      },
      {
        onReadyForServerApproval(paymentId) {
          console.log('Send paymentId to backend:', paymentId);
        },
        onReadyForServerCompletion(paymentId, txid) {
          console.log('Complete on backend with txid:', txid);
        },
        onCancel(paymentId) {
          console.log('User canceled payment:', paymentId);
        },
        onError(error, payment) {
          console.error('Payment error:', error);
        },
      }
    );
  }, []);

  return { user, loginWithPi, unlockQuest };
}

const App = memo(() => {
  const { user, loginWithPi, unlockQuest } = usePiAuth();

  return (
    <main className="App">
      <h1>Palace of Quests</h1>
      {user ? (
        <>
          <p>Welcome, <strong>{user.username}</strong>!</p>
          <button type="button" onClick={unlockQuest}>
            Unlock Dragon Quest
          </button>
        </>
      ) : (
        <button type="button" onClick={loginWithPi}>
          Login with Pi Wallet
        </button>
      )}
    </main>
  );
});
const loginWithPi = async () => {
  try {
    const scopes = ['username', 'payments'];
    const auth = await window.Pi.authenticate(scopes, (payment) => {
      console.log('Found incomplete payment:', payment);
    });

    const { user, accessToken } = auth;
    setUser(user);

    // Send token to backend for verification + session setup
    await fetch('http://localhost:5000/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken })
    });

    console.log('User verified with backend:', user.username);
  } catch (err) {
    console.error('Login error:', err);
  }
};
export default App;
