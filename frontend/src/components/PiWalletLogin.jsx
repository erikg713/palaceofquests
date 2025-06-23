import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PiNetwork } from '../piClient';

const PiWalletLogin = ({ onLogin }) => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = useCallback(async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const scopes = ['username', 'payments'];
      const user = await PiNetwork.authenticate(scopes);
      setUsername(user?.username || '');
      onLogin?.(user);
    } catch (error) {
      // Log for development, but show friendly error to user
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Pi Auth Error:', error);
      }
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onLogin]);

  return (
    <div className="pi-wallet-login" style={{ minHeight: 60, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      {username ? (
        <p style={{ margin: 0 }}>Welcome, <strong>{username}</strong>!</p>
      ) : (
        <>
          <button
            type="button"
            onClick={handleLogin}
            className="btn login-btn"
            aria-label="Login with Pi Network"
            disabled={loading}
            style={{
              padding: '0.5em 1.5em',
              fontSize: '1rem',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: errorMsg ? 8 : 0,
            }}
          >
            {loading ? 'Logging in...' : 'Login with Pi'}
          </button>
          {errorMsg && (
            <span style={{ color: '#d32f2f', fontSize: 14 }}>{errorMsg}</span>
          )}
        </>
      )}
    </div>
  );
};

PiWalletLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default PiWalletLogin;
