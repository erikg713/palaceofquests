import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Router from './router';

/**
 * App shell: the navbar plus the router. Pi sign-in is offered on the Home
 * screen (and the wallet chip in the navbar shows the signed-in Pioneer);
 * the game stays explorable without Pi so it can be previewed anywhere.
 * The navbar lives INSIDE the BrowserRouter — its NavLinks need router
 * context.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-shadow text-white font-sans">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-16">
          <Router />
        </main>
        <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-400">
          Palace of Quests — a Pi Network metaverse. Testnet. QuestDAO governance
          is not wired up (a Solidity DAO cannot run on Pi Network).
        </footer>
      </div>
    </BrowserRouter>
  );
}
