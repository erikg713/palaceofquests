import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Quests from '../pages/Quests';
import QuestDetail from '../pages/QuestDetail';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="quests" element={<Quests />} />
        <Route path="quests/:id" element={<QuestDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
