import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf8');

    console.log("🟢 Body recibido:", rawBody);

    const { userId, amount, currency } = JSON.parse(rawBody);

    console.log("✅ Petición parseada:", { userId, amount, currency });

    if (!userId || amount == null || !currency) {
      console.error("❌ Faltan datos");
      return res.status(400).json({ error: "Faltan datos" });
    }

    const column = `balance_${currency}`;
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select(column)
      .eq("id", userId)
      .single();

    if (fetchError || !profile) {
      console.error("❌ Usuario no encontrado o error al buscar:", fetchError);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const current = profile[column] || 0;
    const nuevoSaldo = current + parseFloat(amount);

    console.log(`➡️ ${column}: actual ${current} → nuevo ${nuevoSaldo}`);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [column]: nuevoSaldo })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Error al actualizar balance:", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    console.log("✅ Saldo actualizado correctamente:", nuevoSaldo);
    return res.status(200).json({ success: true, newBalance: nuevoSaldo });

  } catch (err) {
    console.error("🔥 Error general:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
