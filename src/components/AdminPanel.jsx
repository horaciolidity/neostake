import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt');

 const handleRecharge = async () => {
  const userId = '7bfe7cea-4164-4830-8148-392c2cc42b52'; // <- O el que selecciones

  try {
    const res = await fetch('/api/update-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        amount: parseFloat(amount),
        currency
      })
    });

    const data = await res.json();

    if (!res.ok) {
      toast({ title: 'Error', description: data.error || 'Algo salió mal' });
      return;
    }

    toast({ title: 'Saldo recargado', description: 'El saldo fue actualizado correctamente' });
    setAmount('');
  } catch (err) {
    toast({ title: 'Error de red', description: err.message });
  }
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
