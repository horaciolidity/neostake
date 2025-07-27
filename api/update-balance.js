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

  const { userId, amount, currency } = req.body;

  if (!userId || !amount || !currency) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  // 1. Obtener el perfil
  const { data: userProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError || !userProfile) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // 2. Calcular nuevo balance
  const newBalance = (userProfile[`balance_${currency}`] || 0) + parseFloat(amount);

  // 3. Actualizar
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ [`balance_${currency}`]: newBalance })
    .eq('id', userId);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.status(200).json({ success: true });
}
