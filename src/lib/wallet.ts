import { supabase } from './supabaseClient'

export async function rechargeBalance(userId: string, amount: number, currency = 'usdt', description = 'Recarga manual') {
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

export async function getUserBalance(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('balance_usdt, balance_eth, balance_btc')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function getWalletHistory(userId: string) {
  const { data, error } = await supabase
    .from('wallet_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}
