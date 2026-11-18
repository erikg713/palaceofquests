import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

const PiAuthContext = createContext<{ user: User | null }>({ user: null });

export const PiAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      console.warn('[PiAuth] Supabase is not configured — auth state stays empty.');
      return;
    }

    const init = async () => {
      const { data } = await client.auth.getUser();
      setUser(data?.user || null);
    };

    init();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <PiAuthContext.Provider value={{ user }}>{children}</PiAuthContext.Provider>;
};

export const usePiAuth = () => useContext(PiAuthContext);
