// /api/update-balance.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, context) {
  const body = await req.json(); // para Edge Functions
  const { userId, amount, currency } = body;

  if (!userId || !amount || !currency) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select(`balance_${currency}`)
    .eq('id', userId)
    .single();

  if (fetchError || !profile) {
    return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const nuevoSaldo = Number(profile[`balance_${currency}`] || 0) + Number(amount);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ [`balance_${currency}`]: nuevoSaldo })
    .eq('id', userId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
