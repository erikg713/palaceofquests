import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PlayerHUD from "../components/PlayerHUD";

export default function GameOverlay({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    getUser();
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {userId && <PlayerHUD userId={userId} />}
      <div className="p-6">{children}</div>
    </div>
  );
}
