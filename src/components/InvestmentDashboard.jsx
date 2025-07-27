// components/InvestmentDashboard.js
import { useInvestments } from '@/lib/useInvestments';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '@/lib/supabaseClient';

const InvestmentDashboard = ({ userId }) => {
  const investments = useInvestments(userId);
  const [fee, setFee] = useState(6);

  const handleClaim = async (id) => {
    await supabase.from('investments').update({ claimed: true }).eq('id', id);
    location.reload();
  };

  const chartData = {
    labels: investments.map(inv => inv.plan_name),
    datasets: [{
      label: 'Ganancia Estimada',
      data: investments.map(inv => inv.earned.toFixed(2)),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
    }]
  };

  return (
    <div className="p-4 space-y-6">
      <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg shadow-xl z-50 text-sm">
        Fee de retiro: <strong>{fee}%</strong><br />
        {new Date().toLocaleString()}
      </div>

      <h2 className="text-xl font-bold">Tus Inversiones</h2>

      {investments.map(inv => (
        <div key={inv.id} className="bg-gray-800 p-4 rounded-xl">
          <p><strong>Plan:</strong> {inv.plan_name}</p>
          <p><strong>Monto:</strong> {inv.amount} USDT</p>
          <p><strong>Ganancia acumulada:</strong> {inv.earned.toFixed(2)} USDT</p>
          <p><strong>Progreso:</strong> {(inv.progress * 100).toFixed(1)}%</p>
          <button
            className="bg-green-600 text-white px-4 py-1 rounded mt-2"
            onClick={() => handleClaim(inv.id)}
            disabled={inv.progress < 1}
          >
            {inv.progress < 1 ? 'Pendiente...' : 'Reclamar Ganancias'}
          </button>
        </div>
      ))}

      <div className="bg-gray-900 p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Historial de Ganancias</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default InvestmentDashboard;
