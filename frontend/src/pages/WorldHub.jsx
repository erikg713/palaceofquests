// src/pages/WorldHub.jsx import React from 'react'; import { useNavigate } from 'react-router-dom';

const WorldHub = () => { const navigate = useNavigate();

const teleport = (zone) => { alert(Teleporting to ${zone} realm...); // navigate(/realm/${zone}); };

return ( <div className="relative bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url(https://cdn.openai.com/images/fantasy-realm-hub.jpg)', }} > <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white"> <h1 className="text-4xl font-bold mb-8">Arcane Kingdom Portal</h1> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> <button onClick={() => teleport('Mystic Forest')} className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-lg shadow-md">Mystic Forest</button> <button onClick={() => teleport('Crimson Volcano')} className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-lg shadow-md">Crimson Volcano</button> <button onClick={() => teleport('Celestial Tower')} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-lg shadow-md">Celestial Tower</button> </div> </div> </div> ); };

export default WorldHub;

// src/App.jsx (update to use React Router) import React from 'react'; import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; import InventoryPage from './pages/InventoryPage'; import WorldHub from './pages/WorldHub';

const App = () => ( <Router> <Routes> <Route path="/" element={<WorldHub />} /> <Route path="/inventory" element={<InventoryPage />} /> </Routes> </Router> );

export default App;

// src/pages/WorldHub.jsx import React from 'react'; import { useNavigate } from 'react-router-dom';

const WorldHub = () => { const navigate = useNavigate();

const teleport = (zone) => { alert(Launching from Space Elevator to ${zone}...); // navigate(/realm/${zone}); };

return ( <div className="relative bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url(https://cdn.openai.com/images/fantasy-realm-hub.jpg)', }} > <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center"> <h1 className="text-4xl font-extrabold mb-4 text-cyan-300">Launch Platform: Pi Defense Protocol</h1> <p className="max-w-xl mb-6 text-lg text-gray-200">Can you and your allies defend the magical realms and Earth from an alien AI swarm? Board the space elevator and prepare to fight among the stars.</p> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> <button onClick={() => teleport('Moon Fortress')} className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl text-lg shadow-xl">Launch to Moon Fortress</button> <button onClick={() => teleport('Plasma Citadel')} className="bg-fuchsia-600 hover:bg-fuchsia-700 px-6 py-3 rounded-xl text-lg shadow-xl">Launch to Plasma Citadel</button> <button onClick={() => teleport('Hive Nexus')} className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-xl text-lg shadow-xl">Engage Hive Nexus</button> </div> </div> </div> ); };

export default WorldHub;

const isUnlocked = userUnlocks.includes(realm.id);
{isUnlocked ? (
  <button onClick={() => teleport(realm.id)}>Enter</button>
) : (
  <PiPaymentButton ... />
)}