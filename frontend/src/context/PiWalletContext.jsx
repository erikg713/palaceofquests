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
