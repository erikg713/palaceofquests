import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const PiWalletContext = createContext(null);

export const PiWalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [piUser, setPiUser] = useState(null);

  const connectWallet = async () => {
    try {
      const Pi = window?.Pi;
      if (!Pi) throw new Error('Pi SDK is not available.');

      const user = await Pi.authenticate(['username', 'payment']);
      setPiUser(user);
      setWalletAddress(user?.username || null);
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
    }
  };

  return (
    <PiWalletContext.Provider value={{ walletAddress, connectWallet, piUser }}>
      {children}
    </PiWalletContext.Provider>
  );
};

PiWalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for easier access to the context
export const usePiWallet = () => {
  const context = useContext(PiWalletContext);
  if (!context) {
    throw new Error('usePiWallet must be used within a PiWalletProvider');
  }
  return context;
};
