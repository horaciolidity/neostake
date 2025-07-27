import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req) {
  try {
    const body = await req.json();
    const { userId, amount, currency } = body;

    console.log("🟢 API handler ejecutado con:", { userId, amount, currency });

    if (!userId || amount == null || !currency) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const balanceColumn = `balance_${currency}`;

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select(balanceColumn)
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      console.error("❌ Error al buscar el perfil:", fetchError);
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const currentBalance = profile[balanceColumn] || 0;
    const newBalance = currentBalance + Number(amount);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ [balanceColumn]: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error("❌ Error al actualizar balance:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("✅ Balance actualizado correctamente:", newBalance);

    return new Response(JSON.stringify({ success: true, newBalance }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error("❌ Error inesperado en handler:", e);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
