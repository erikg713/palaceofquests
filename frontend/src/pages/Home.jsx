import React, { useContext, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentButton from '../components/PiPaymentButton';
import HUD from '../components/ui/HUD';
import { realms } from '../data/realms';
import { questsWithProgress } from '../data/quests';

const StatusMessage = memo(({ message }) =>
  message ? (
    <div className="mt-4 text-center text-sm" role="alert">
      {message}
    </div>
  ) : null
);

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
          className="mt-4 bg-gold hover:brightness-110 text-black font-bold px-6 py-2 rounded-lg shadow transition"
          onClick={onShowPayment}
          aria-label="Unlock with Pi payment"
        >
          Pay with Pi to Unlock Access
        </button>
      ) : (
        <PiPaymentButton
          amount={1}
          memo="Unlock Palace Home"
          metadata={{ page: 'Home' }}
          onPaymentComplete={onPaymentComplete}
          onPaymentError={onPaymentError}
        />
      )}
      <StatusMessage message={paymentStatus} />
    </div>
  )
);

const ConnectWalletButton = memo(({ onConnect }) => (
  <button
    className="mt-4 bg-quest-royal hover:bg-quest-deep text-white py-2 px-6 rounded-lg font-semibold shadow transition"
    onClick={onConnect}
    aria-label="Connect Pi Wallet"
  >
    Connect Pi Wallet
  </button>
));

export default function Home() {
  const { walletAddress, piUser, connectWallet, authError } =
    useContext(PiWalletContext);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePaymentComplete = useCallback(() => {
    setPaymentStatus('Payment complete — welcome to the Palace!');
  }, []);
  const handlePaymentError = useCallback(() => {
    setPaymentStatus('Payment did not go through. Nothing was charged.');
  }, []);

  const availableQuests = questsWithProgress().filter(
    (q) => q.status === 'available'
  );

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Palace of Quests</h1>
        <p className="hero-subtitle">
          Explore realms, take quests, and trade loot — on Pi Network.
        </p>
        {!walletAddress ? (
          <>
            <ConnectWalletButton onConnect={connectWallet} />
            {authError ? (
              <StatusMessage message={authError} />
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                Sign in with Pi in Pi Browser to link your Pioneer identity.
              </p>
            )}
          </>
        ) : (
          <WalletPanel
            address={walletAddress}
            showPayment={showPayment}
            onShowPayment={() => setShowPayment(true)}
            paymentStatus={paymentStatus}
            onPaymentComplete={handlePaymentComplete}
            onPaymentError={handlePaymentError}
          />
        )}
      </section>

      <section className="mb-8">
        <HUD
          username={piUser ? piUser.username : 'Adventurer'}
          xp={1200}
          coins={250}
        />
      </section>

      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">Realms</h2>
          <Link to="/world" className="text-sm text-gold hover:underline">
            Explore all realms →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {realms.map((realm) => (
            <div key={realm.id} className="palace-card realm-card">
              <h3 className="text-lg font-bold">{realm.name}</h3>
              <p className="text-sm text-gray-300 mt-1">{realm.description}</p>
              <p className="mt-3 text-sm text-gold">
                Unlock: {realm.unlockCost} Pi
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">Quests waiting</h2>
          <Link to="/quests" className="text-sm text-gold hover:underline">
            View all quests →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableQuests.slice(0, 4).map((q) => (
            <Link
              key={q.id}
              to={`/quests/${q.id}`}
              className="palace-card hover:border-gold/60 transition"
            >
              <h3 className="font-bold">{q.title}</h3>
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                {q.description}
              </p>
              <p className="mt-2 text-sm text-gold">
                ⭐ {q.reward_xp} XP
                {q.reward_coins > 0 ? ` · 🪙 ${q.reward_coins} Pi` : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
