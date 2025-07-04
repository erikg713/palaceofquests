import { useContext, useEffect, useState, useCallback, memo } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
import PiPaymentButton from '../components/PiPaymentButton';

// Status message component
const StatusMessage = memo(({ message }) => (
  message ? (
    <div className="mt-4 text-center text-sm" role="alert">
      {message}
    </div>
  ) : null
));

// Connected wallet info and payment section
const WalletPanel = memo(({ address, showPayment, onShowPayment, paymentStatus, onPaymentComplete, onPaymentError }) => (
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
));

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

export default function Home() {
  const { walletAddress, connectWallet } = useContext(PiWalletContext);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    document.title = "Palace of Quests – Home";
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      await connectWallet();
    } catch {
      setPaymentStatus('Failed to connect wallet. Please refresh and try again.');
    }
  }, [connectWallet]);

  const handlePaymentComplete = useCallback(() => {
    setPaymentStatus('✅ Payment successful! Welcome to the adventure.');
    setShowPayment(false);
    // You can trigger unlocks, navigation, or UI updates here
  }, []);

  const handlePaymentError = useCallback((error) => {
    setPaymentStatus(`❌ Payment failed: ${error?.message || 'Unknown error.'}`);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] text-white px-4">
      <div className="max-w-md w-full p-8 rounded-xl shadow-2xl bg-black/70 backdrop-blur-md">
        <header className="mb-6">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <span role="img" aria-label="Palace">🏰</span> Palace of Quests
          </h1>
          <p className="mt-2 text-lg text-slate-200">
            An epic Web3 adventure built for the Pi Network.
          </p>
        </header>

        {walletAddress ? (
          <WalletPanel
            address={walletAddress}
            showPayment={showPayment}
            onShowPayment={() => setShowPayment(true)}
            paymentStatus={paymentStatus}
            onPaymentComplete={handlePaymentComplete}
            onPaymentError={handlePaymentError}
          />
        ) : (
          <ConnectWalletButton onConnect={handleConnect} />
        )}
      </div>
      <footer className="mt-12 text-xs text-slate-500 opacity-80">
        &copy; {new Date().getFullYear()} Palace of Quests. All rights reserved.
      </footer>
    </section>
  );
}
