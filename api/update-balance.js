import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req) {
  try {
    const { userId, amount, currency } = await req.json();

    console.log("✅ Petición recibida", { userId, amount, currency });

    if (!userId || amount == null || !currency) {
      console.log("❌ Datos incompletos");
      return new Response(JSON.stringify({ error: "Faltan datos" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const column = `balance_${currency}`;

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select(column)
      .eq("id", userId)
      .single();

    if (fetchError || !profile) {
      console.log("❌ Usuario no encontrado", fetchError);
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const current = profile[column] || 0;
    const nuevoSaldo = current + parseFloat(amount);

    console.log(`➡️ Saldo actual: ${current} | Nuevo: ${nuevoSaldo}`);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [column]: nuevoSaldo })
      .eq("id", userId);

    if (updateError) {
      console.log("❌ Error al actualizar saldo", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("✅ Saldo actualizado con éxito");

    return new Response(JSON.stringify({ success: true, newBalance: nuevoSaldo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.log("❌ Error general", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
