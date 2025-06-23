import RealmMap from '../components/RealmMap';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function WorldMapPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    getUser();
  }, []);

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <h1 className="text-3xl font-bold mb-4">🗺️ Realm Travel</h1>
      <RealmMap userId={userId} />
    </div>
  );
}