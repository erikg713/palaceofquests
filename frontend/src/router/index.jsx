import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Quests from '../pages/Quests';
import QuestDetail from '../pages/QuestDetail';
import WorldHub from '../pages/WorldHub';
import Marketplace from '../pages/Marketplace';
import InventoryPage from '../pages/InventoryPage';
import NPCPage from '../pages/NPCPage';

function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">No realm here.</h1>
      <p className="text-gray-400 mt-2">That path does not exist in the palace.</p>
    </div>
  );
}

export default function Router() {
  // Note: BrowserRouter lives in App.jsx so the navbar shares router context.
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/world" element={<WorldHub />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/quests/:id" element={<QuestDetail />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/npcs" element={<NPCPage />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
