import { useContext, useEffect, useState } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';
// Assume Pi SDK is globally available or imported as needed

function Home() {
  const { walletAddress, connectWallet } = useContext(PiWalletContext);
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    document.title = "Palace of Quests - Home";
  }, []);

  // Example: Payment handler
  const handlePayment = async () => {
    if (!window.Pi) {
      setPaymentStatus('Pi SDK not available.');
      return;
    }

    try {
      const payment = await window.Pi.createPayment({
        // Replace with your payment parameters
        amount: 1,
        memo: "Test payment for PoQ landing page",
        metadata: { type: "landingPageTest" }
      });
      setPaymentStatus('Payment successful!');
    } catch (err) {
      setPaymentStatus('Payment failed or cancelled.');
    }
  };

  return (
    <div className="home-container text-center p-10 text-white">
      <h1 className="text-4xl font-bold mb-2">🏰 Palace of Quests</h1>
      <p className="mb-4 text-lg">An epic Web3 adventure built for the Pi Network.</p>

      {walletAddress ? (
        <>
          <p className="mb-2">Connected as: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-4"
            onClick={handlePayment}
            aria-label="Make Payment"
          >
            Make a Test Payment
          </button>
          {paymentStatus && <p className="mt-2 text-sm">{paymentStatus}</p>}
        </>
      ) : (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={connectWallet}
          aria-label="Connect Pi Wallet"
        >
          Connect Pi Wallet
        </button>
      )}
    </div>
  );
}

export default Home;
