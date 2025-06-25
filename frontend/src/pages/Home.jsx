import { useContext } from 'react';
import { PiWalletContext } from '../context/PiWalletContext';

export default function Home() {
  const { walletAddress, connectWallet } = useContext(PiWalletContext);

  return (
    <div className="home-container text-center p-10 text-white">
      <h1 className="text-4xl font-bold">🏰 Palace of Quests</h1>
      <p className="mt-2 text-lg">An epic Web3 adventure built for the Pi Network.</p>
      
      {walletAddress ? (
        <p className="mt-4">Connected as: {walletAddress}</p>
      ) : (
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={connectWallet}
        >
          Connect Pi Wallet
        </button>
      )}
    </div>
  );
}