import React, { createContext, useState, useEffect } from 'react';

export const PiWalletContext = createContext();

export const PiWalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    try {
      const result = await window?.Pi?.authenticate(); // pseudo-SDK call
      setWalletAddress(result?.address);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  return (
    <PiWalletContext.Provider value={{ walletAddress, connectWallet }}>
      {children}
    </PiWalletContext.Provider>
  );
};. 
export const PiWalletContext = createContext();

export const PiWalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [piUser, setPiUser] = useState(null);

  const connectWallet = async () => {
    const Pi = window.Pi;
    if (!Pi) return;

    const user = await Pi.authenticate(['username', 'payment']);
    setPiUser(user);
    setWalletAddress(user?.username || null);
  };

  return (
    <PiWalletContext.Provider value={{ walletAddress, connectWallet, piUser }}>
      {children}
    </PiWalletContext.Provider>
  );
};