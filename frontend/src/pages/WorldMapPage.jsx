import { useEffect, useState } from 'react';
import RealmMap from '../components/RealmMap';
import { supabase } from '../lib/supabaseClient';

// WorldMapPage: Displays the interactive Realm Map for users
export default function WorldMapPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch the authenticated user's ID only if the component is mounted
    const fetchUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted) setUserId(user?.id ?? null);
      } catch (error) {
        // Optional: Add error logging here for debugging
        if (isMounted) setUserId(null);
      }
    };

    fetchUserId();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <header>
        <h1 className="text-3xl font-bold mb-4">🗺️ Realm Travel</h1>
      </header>
      {/* Pass userId to RealmMap only when available */}
      <RealmMap userId={userId} />
    </div>
  );
}
