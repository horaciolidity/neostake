// api/update-balance.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Solo usar aquí
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { userId, amount, currency } = req.body;

  if (!userId || !amount || !currency) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  // Buscar perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`balance_${currency}`)
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const newBalance = (profile[`balance_${currency}`] || 0) + parseFloat(amount);

  const { error } = await supabase
    .from('profiles')
    .update({ [`balance_${currency}`]: newBalance })
    .eq('id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
};
