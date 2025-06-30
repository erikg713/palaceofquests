import { supabase } from './supabase';

export async function fetchPlayerProfile(pi_uid: string) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('pi_uid', pi_uid)
    .single();

  if (error) {
    console.error('Supabase player fetch error:', error.message);
    return null;
  }

  return data;
}