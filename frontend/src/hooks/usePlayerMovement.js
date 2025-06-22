import { useEffect, useRef } from 'react';
import { supabase } from '../api/supabaseClient';

export function usePlayerMovement(userId, setPosition) {
  const position = useRef({ x: 0, y: 1, z: 0 });

  useEffect(() => {
    const handleKey = (e) => {
      const speed = 0.25;
      if (e.key === 'w') position.current.z -= speed;
      if (e.key === 's') position.current.z += speed;
      if (e.key === 'a') position.current.x -= speed;
      if (e.key === 'd') position.current.x += speed;
      if (setPosition) setPosition({ ...position.current });

      supabase.from('player_positions').upsert({
        user_id: userId,
        ...position.current,
        updated_at: new Date(),
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [userId, setPosition]);
}