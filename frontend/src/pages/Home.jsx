import { useContext, useEffect, useState, useCallback, memo } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentButton from '../components/PiPaymentButton';
import React from 'react';
import { Link } from 'react-router-dom';
import HUD from '../components/ui/HUD';

return (
  <div className="p-8">
    <HUD username="Adventurer" xp={1200} coins={250} />
    <Link to="/quests" className="mt-4 inline-block text-blue-600">
      View Quests
    </Link>
  </div>
);

// Status message component
const StatusMessage = memo(({ message }) =>
  message ? (
    <div className="mt-4 text-center text-sm" role="alert">
      {message}
    </div>
  ) : null
);

// Connected wallet info and payment section
const WalletPanel = memo(
  ({
    address,
    showPayment,
    onShowPayment,
    paymentStatus,
    onPaymentComplete,
    onPaymentError,
  }) => (
    <div className="flex flex-col items-center">
      <span className="text-green-400 font-semibold text-sm mb-2">
        Connected: {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      {!showPayment ? (
        <button
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg shadow transition"
          onClick={onShowPayment}
          aria-label="Unlock with Pi payment"
        >
          Pay with Pi to Unlock Access
        </button>
      ) : (
        <PiPaymentButton
          amount={1}
          memo="Unlock Palace Home"
          metadata={{ page: "Home" }}
          onPaymentComplete={onPaymentComplete}
          onPaymentError={onPaymentError}
        />
      )}
      <StatusMessage message={paymentStatus} />
    </div>
  )
);

// Connect wallet button
const ConnectWalletButton = memo(({ onConnect }) => (
  <button
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-semibold shadow transition"
    onClick={onConnect}
    aria-label="Connect Pi Wallet"
  >
    Connect Pi Wallet
  </button>
));
