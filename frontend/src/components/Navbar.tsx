import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex gap-4">
      <Link to="/">World Hub</Link>
      <Link to="/inventory">Inventory</Link>
      <Link to="/quests">Quests</Link>
      <Link to="/marketplace">Marketplace</Link>
    </nav>
  );
}