import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PiWalletProvider } from './context/PiWalletContext.jsx';
import { mockPiSDK } from './utils/mockPi.js';

mockPiSDK();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PiWalletProvider>
      <App />
    </PiWalletProvider>
  </React.StrictMode>
);
