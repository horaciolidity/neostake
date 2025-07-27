// /api/update-balance.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = {};
  try {
    body = JSON.parse(req.body); // Válido para Vercel + Vite (Node.js runtime)
  } catch (error) {
    return res.status(400).json({ error: 'Cuerpo inválido' });
  }

  const { email, amount, currency } = body;

  if (!email || !amount || !currency) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Buscar el usuario en la tabla "profiles" por email
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (userError || !user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const updatedBalance = (user[`balance_${currency}`] || 0) + parseFloat(amount);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ [`balance_${currency}`]: updatedBalance })
    .eq('id', user.id);

  if (updateError) {
    return res.status(500).json({ error: 'Error al actualizar saldo' });
  }

  return res.status(200).json({ success: true });
}
