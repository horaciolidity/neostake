import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AdminRechargePanel = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usdt');
  const [description, setDescription] = useState('Recarga admin');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRecharge = async () => {
    setLoading(true);
    setResult(null);

    const parsed = parseFloat(amount);
    if (!parsed || !userId) {
      setResult('Completa todos los campos');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('wallet_transactions').insert([
      {
        user_id: userId,
        amount: parsed,
        type: 'recharge',
        currency,
        description,
      },
    ]);

    setLoading(false);
    if (error) {
      setResult('Error: ' + error.message);
    } else {
      setResult('✅ Recarga exitosa');
      setUserId('');
      setAmount('');
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow mt-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Recargar saldo a un usuario</h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          className="border px-3 py-2 rounded"
          placeholder="UUID del usuario"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usdt">USDT</option>
          <option value="eth">ETH</option>
          <option value="btc">BTC</option>
        </select>
        <textarea
          className="border px-3 py-2 rounded"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleRecharge}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
        {result && <p className="mt-2">{result}</p>}
      </div>
    </div>
  );
};
