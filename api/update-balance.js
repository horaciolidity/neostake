// /api/update-balance.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, context) {
  try {
    const body = await req.json();
    const { userId, amount, currency } = body;

    if (!userId || amount == null || !currency) {
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

    const currentBalance = profile[`balance_${currency}`] || 0;
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ [`balance_${currency}`]: newBalance })
      .eq('id', userId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, newBalance }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
