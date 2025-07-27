import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [userId, setuserId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt');

const handleRecharge = async () => {
  const cleanuserId = userId.trim().toLowerCase();

  try {
    const res = await fetch('/api/update-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: cleanuserId,
        amount: parseFloat(amount),
        currency
      })
    });

    const data = await res.json();

    if (!res.ok) {
      toast({
        title: 'Error al recargar',
        description: data.error || 'Error desconocido'
      });
      return;
    }

    toast({
      title: 'Saldo recargado',
      description: `Nuevo balance actualizado`
    });

    setuserId('');
    setAmount('');
  } catch (err) {
    toast({
      title: 'Error de red',
      description: err.message
    });
  }
};

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Panel de Administrador</h2>
      <input
        type="userId"
        placeholder="Correo del usuario"
        value={userId}
        onChange={(e) => setuserId(e.target.value)}
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
