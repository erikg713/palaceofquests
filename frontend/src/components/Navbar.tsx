import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'World Hub' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/quests', label: 'Quests' },
  { to: '/marketplace', label: 'Marketplace' },
];

export default function Navbar() {
  return (
    <header>
      <nav
        className="bg-gray-900 text-white px-6 py-4 flex gap-6 items-center shadow"
        aria-label="Main navigation"
      >
        <h1 className="text-xl font-bold tracking-wide mr-8">Palace of Quests</h1>
        <ul className="flex gap-4">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? 'font-semibold border-b-2 border-yellow-400 transition-colors'
                    : 'hover:text-yellow-300 transition-colors'
                }
                end
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
