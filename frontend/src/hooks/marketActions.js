// src/hooks/marketActions.js
//
// Marketplace purchase actions. A purchase pays with Pi through the SDK
// (initiatePiPayment) and, when Supabase is configured, records the item in
// the buyer's inventory. Without a backend/Supabase connection the payment
// step reports honestly instead of pretending the purchase completed.

import { initiatePiPayment } from '../utils/piPayment';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Buy a market item for a user.
 * @param {string} userId — Pi UID of the buyer
 * @param {{ id: string, price: number, name: string }} marketItem
 */
export async function buyMarketItem(userId, marketItem) {
  if (!marketItem || typeof marketItem.price !== 'number') {
    throw new Error('Invalid market item.');
  }

  const { paymentId, txid } = await initiatePiPayment({
    uid: userId,
    amount: marketItem.price,
    memo: `Purchase: ${marketItem.name}`,
    metadata: { item_id: marketItem.id },
  });

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('inventory').insert({
      user_id: userId,
      item_id: marketItem.id,
      payment_id: paymentId,
      txid,
    });
    if (error) {
      console.error('Failed to record purchase in inventory:', error);
      throw new Error('Payment went through but the item could not be recorded. Contact support with payment id ' + paymentId + '.');
    }
  }

  return { paymentId, txid };
}
