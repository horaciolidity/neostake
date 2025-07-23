import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt');

  const handleRecharge = async () => {
    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !userProfile) {
      toast({ title: 'Usuario no encontrado', description: 'Verifica el correo electrónico.' });
      return;
    }

    const updatedBalance = (userProfile[`balance_${currency}`] || 0) + parseFloat(amount);

    await supabase
      .from('profiles')
      .update({ [`balance_${currency}`]: updatedBalance })
      .eq('id', userProfile.id);

    toast({ title: 'Saldo recargado', description: `Se han añadido ${amount} ${currency.toUpperCase()} a ${email}` });

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
      </select>
      <Button onClick={handleRecharge} className="w-full">
        Recargar saldo
      </Button>
    </div>
  );
};

export default AdminPanel;
