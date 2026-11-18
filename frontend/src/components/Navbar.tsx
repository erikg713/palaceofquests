import { NavLink } from 'react-router-dom';
import { usePiWallet } from '../context/PiWalletContext.jsx';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/world', label: 'Realms' },
  { to: '/quests', label: 'Quests' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/npcs', label: 'NPCs' },
];

export default function Navbar() {
  // PiWalletContext is plain JS, so type the values we use here.
  const { piUser, connectWallet } = usePiWallet() as {
    piUser: { username: string } | null;
    connectWallet: () => void;
  };

  return (
    <header className="sticky top-0 z-40">
      <nav
        className="bg-abyss/95 backdrop-blur text-white px-4 sm:px-6 py-3 flex flex-wrap gap-x-6 gap-y-2 items-center shadow border-b border-white/10"
        aria-label="Main navigation"
      >
        <h1 className="text-lg sm:text-xl font-bold tracking-wide font-display">
          Palace of Quests
        </h1>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold border-b-2 border-gold transition-colors'
                    : 'hover:text-gold transition-colors'
                }
                end={to === '/'}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="ml-auto">
          {piUser ? (
            <span className="chip" title={`Signed in as ${piUser.username}`}>
              π @{piUser.username}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="text-sm font-semibold bg-quest-royal hover:bg-quest-deep px-3 py-1.5 rounded-lg transition"
            >
              Sign in with Pi
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
