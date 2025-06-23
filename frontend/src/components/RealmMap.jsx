import { useEffect, useState } from 'react';
import { realms } from '../data/realms';
import { supabase } from '../lib/supabaseClient';
import PiPaymentButton from './PiPaymentButton';

export default function RealmMap({ userId }) {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const loadUnlocks = async () => {
      const { data, error } = await supabase
        .from('unlocks')
        .select('realm_id')
        .eq('user_id', userId);
      if (data) setUnlocked(data.map(r => r.realm_id));
    };
    loadUnlocks();
  }, [userId]);

  const teleport = (realmId) => {
    alert(`🌀 Teleporting to ${realmId}...`);
    // Add actual navigation logic later
  };

  const unlockRealm = async (realmId) => {
    await fetch('/unlock-realm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, realm_id: realmId })
    });
    setUnlocked(prev => [...prev, realmId]);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-black to-gray-900 rounded-xl border-4 border-purple-800 overflow-hidden">
      {realms.map((realm) => {
        const [x, y] = realm.coordinates;
        const isUnlocked = unlocked.includes(realm.id);
        return (
          <div
            key={realm.id}
            style={{ left: x, top: y }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            <img src={realm.image} alt={realm.name} className="w-20 h-20 rounded-full border-2 border-white mb-1" />
            <div className="text-center">
              <p className="text-sm font-bold">{realm.name}</p>
              {isUnlocked ? (
                <button
                  className="mt-1 text-xs bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
                  onClick={() => teleport(realm.id)}
                >
                  Enter
                </button>
              ) : (
                <PiPaymentButton
                  amount={realm.unlockCost}
                  memo={`Unlock ${realm.name}`}
                  metadata={{ type: 'unlock', realmId: realm.id }}
                  onPaymentComplete={() => unlockRealm(realm.id)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}