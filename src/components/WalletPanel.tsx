import React, { useEffect, useState } from 'react';
import { getUserBalance, getWalletHistory, rechargeBalance } from '../lib/wallet';


interface Props {
  userId: string;
}

export const WalletPanel: React.FC<Props> = ({ userId }) => {
  const [balance, setBalance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await getUserBalance(userId);
    const { data: hist } = await getWalletHistory(userId);
    setBalance(data);
    setHistory(hist || []);
  };

  const handleRecharge = async () => {
    setLoading(true);
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    await rechargeBalance(userId, parsed);
    setAmount('');
    await fetchData();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <div className="p-4 border rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Mi Billetera</h2>
      {balance && (
        <div className="mb-4">
          <p>USDT: {balance.balance_usdt}</p>
          <p>ETH: {balance.balance_eth}</p>
          <p>BTC: {balance.balance_btc}</p>
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          className="border px-3 py-1 rounded w-32"
          placeholder="Monto USDT"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleRecharge}
          className="bg-blue-600 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          Recargar
        </button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Historial</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Fecha</th>
              <th className="text-left">Tipo</th>
              <th className="text-left">Monto</th>
              <th className="text-left">Moneda</th>
              <th className="text-left">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{new Date(h.created_at).toLocaleString()}</td>
                <td>{h.type}</td>
                <td>{h.change}</td>
                <td>{h.currency}</td>
                <td>{h.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
