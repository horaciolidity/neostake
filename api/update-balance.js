import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge', // Para mejor performance en Vercel (opcional)
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), { status: 400 });
  }

  const { email, amount, currency } = body;

  if (!email || !amount || !currency) {
    return new Response(JSON.stringify({ error: 'Faltan datos' }), { status: 400 });
  }

  // Buscar el perfil
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !profile) {
    return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
  }

  const currentBalance = Number(profile[`balance_${currency}`] || 0);
  const newBalance = currentBalance + Number(amount);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ [`balance_${currency}`]: newBalance })
    .eq('id', profile.id);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
