import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { PiWalletProvider } from './context/PiWalletContext.jsx';
import { mockPiSDK } from './utils/mockpi.js';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { initPi, isPiAvailable } from './piClient.js';
import './index.css';
import './styles/ui.css';

const App = lazy(() => import('./App.jsx'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-shadow text-white">
      <p>Loading the Palace…</p>
    </div>
  );
}

// Pi SDK setup:
// - In Pi Browser / Sandbox, window.Pi comes from the <script> tag in index.html.
// - In local development with no Pi SDK present, install the mock so the game
//   is explorable. The mock is never used in production builds.
if (import.meta.env.DEV && !isPiAvailable()) {
  mockPiSDK();
}
initPi();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PiWalletProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </PiWalletProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
