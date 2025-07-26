import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt');

  const handleRecharge = async () => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Buscar el usuario en auth.users
    const {
      data: { users },
      error: authError
    } = await supabase.auth.admin.listUsers();

    if (authError) {
      toast({ title: 'Error en auth', description: 'No se pudo obtener los usuarios.' });
      return;
    }

    const targetUser = users.find(u => u.email === cleanEmail);

    if (!targetUser) {
      toast({ title: 'Usuario no encontrado', description: 'Verifica el correo electrónico.' });
      return;
    }

    // 2. Buscar el perfil correspondiente
    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUser.id)
      .single();

    if (error || !userProfile) {
      toast({ title: 'Perfil no encontrado', description: 'No se encontró el perfil vinculado al usuario.' });
      return;
    }

    // 3. Actualizar el balance
    const updatedBalance = (userProfile[`balance_${currency}`] || 0) + parseFloat(amount);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ [`balance_${currency}`]: updatedBalance })
      .eq('id', targetUser.id);

    if (updateError) {
      toast({ title: 'Error al actualizar saldo', description: 'No se pudo guardar el nuevo saldo.' });
      return;
    }

    toast({
      title: 'Saldo recargado',
      description: `Se añadieron ${amount} ${currency.toUpperCase()} a ${cleanEmail}`
    });

    setEmail('');
    setAmount('');
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Panel de Administrador</h2>
      <input
        type="email"
        placeholder="Correo del usuario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
      >
        <option value="usdt">USDT</option>
        <option value="eth">ETH</option>
        <option value="btc">BTC</option>
      </select>
      <Button onClick={handleRecharge} className="w-full">
        Recargar saldo
      </Button>
    </div>
  );
};

export default AdminPanel;
