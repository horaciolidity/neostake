import { supabase } from './supabaseClient';

export async function rechargeBalance(userId, amount, currency = 'usdt', description = 'Recarga de saldo') {
  const { error } = await supabase.from('wallet_transactions').insert([
    {
      user_id: userId,
      amount,
      type: 'recharge',
      currency,
      description,
    },
  ]);

  return { success: !error, error };
}

export async function getUserBalance(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('balance_usdt, balance_eth, balance_btc')
    .eq('id', userId)
    .single();

  return { data, error };
}

export async function getWalletHistory(userId) {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}
