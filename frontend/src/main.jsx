import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { PiWalletProvider } from './context/PiWalletContext.jsx';
import { mockPiSDK } from './utils/mockPi.js';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Utility for environment checks
const isDevelopment = import.meta.env.MODE === 'development';

// Initialize the Pi Network SDK
const initializePiSDK = () => {
  if (isDevelopment) {
    mockPiSDK();
  } else if (!window.Pi) {
    console.error('Pi Network SDK not found. Ensure it is loaded for production builds.');
  }
};

// Authenticate Pi user session in development
const authenticatePiUser = () => {
  if (isDevelopment && window.Pi) {
    window.Pi.authenticate(['username', 'wallet_address'])
      .then(({ user }) => {
        console.info('[DEV] Pi User:', user);
      })
      .catch((err) => {
        console.warn('[DEV] Pi Auth Error:', err);
      });
  }
};

// Initialization logic
initializePiSDK();
authenticatePiUser();

// Lazy load the App component
const App = lazy(() => import('./App.jsx'));

// Customized fallback component for lazy loading
const LoadingFallback = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <p>Loading Pi Platform...</p>
  </div>
);

// Consolidated Render Logic
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <PiWalletProvider>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </PiWalletProvider>
      </DndProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
