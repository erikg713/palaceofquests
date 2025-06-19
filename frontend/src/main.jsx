import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { PiWalletProvider } from './context/PiWalletContext.jsx';
import { mockPiSDK } from './utils/mockPi.js';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';

/**
 * Initialize the Pi Network SDK for wallet and authentication features.
 * Only mock the SDK during development for safety and testing.
 */
if (import.meta.env.MODE === 'development') {
  mockPiSDK();
} else if (!window.Pi) {
  console.error('Pi Network SDK not found. Ensure it is loaded for production builds.');
}

// Optional: Log Pi user session for debugging in development
if (import.meta.env.MODE === 'development' && window.Pi) {
  window.Pi.authenticate(['username', 'wallet_address'])
    .then(({ user }) => {
      console.info('[DEV] Pi User:', user);
    })
    .catch((err) => {
      console.warn('[DEV] Pi Auth Error:', err);
    });
}

const App = lazy(() => import('./App.jsx'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PiWalletProvider>
        <Suspense fallback={<div>Loading Pi Platform...</div>}>
          <App />
        </Suspense>
      </PiWalletProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
