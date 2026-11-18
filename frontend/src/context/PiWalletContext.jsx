import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { authenticatePi, isPiAvailable } from '../piClient';

export const PiWalletContext = createContext(null);

export const PiWalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [piUser, setPiUser] = useState(null);
  const [authError, setAuthError] = useState('');

  const connectWallet = async () => {
    setAuthError('');
    try {
      if (!isPiAvailable()) {
        throw new Error('Pi SDK is not available — open this app in Pi Browser.');
      }
      // Pi SDK 2.0 resolves to { user, accessToken, version }.
      const auth = await authenticatePi(['username']);
      if (!auth || !auth.user) {
        throw new Error('Pi sign-in did not return a user.');
      }
      setPiUser(auth.user);
      // The username is the public Pioneer identity; the wallet address
      // needs the 'wallet_address' scope, requested only at payment time.
      setWalletAddress(auth.user.username);
      // accessToken stays in memory only — never persisted.
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
      setAuthError(error.message || 'Pi sign-in failed.');
    }
  };

  const disconnectWallet = () => {
    setPiUser(null);
    setWalletAddress(null);
    setAuthError('');
  };

  return (
    <PiWalletContext.Provider
      value={{ walletAddress, connectWallet, disconnectWallet, piUser, authError }}
    >
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
