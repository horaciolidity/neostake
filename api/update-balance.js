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

  try {
    const { userId, amount, currency } = req.body;

    if (!userId || !amount || !currency) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const columnName = `balance_${currency.toLowerCase()}`;

    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select(columnName)
      .eq('id', userId)
      .maybeSingle();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const currentBalance = parseFloat(user[columnName]) || 0;
    const updatedBalance = currentBalance + parseFloat(amount);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ [columnName]: updatedBalance })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ success: true, newBalance: updatedBalance });
  } catch (err) {
    console.error('Error inesperado:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
