import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '@/lib/supabaseClient';
import { useInvestments } from '@/lib/useInvestments';

// 📊 Registrar escalas y componentes para evitar errores
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InvestmentDashboard = ({ userId }) => {
  const investments = useInvestments(userId);
  const [fee, setFee] = useState(6);
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (id) => {
    const { error } = await supabase
      .from('investments')
      .update({ claimed: true })
      .eq('id', id);

    if (!error) location.reload();
  };

  const chartData = {
    labels: investments.map((inv) => inv.plan_name),
    datasets: [
      {
        label: 'Ganancia Estimada (USDT)',
        data: investments.map((inv) => inv.earned.toFixed(2)),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Ganancias',
      },
    },
  };

  return (
    <div className="p-4 space-y-6">
      {/* Stat flotante */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg shadow-xl z-50 text-sm">
        Fee de retiro: <strong>{fee}%</strong>
        <br />
        {dateTime}
      </div>

      <h2 className="text-xl font-bold">Tus Inversiones</h2>

      {investments.length === 0 && (
        <p className="text-gray-400">No tienes inversiones activas.</p>
      )}

      {investments.map((inv) => (
        <div key={inv.id} className="bg-gray-800 p-4 rounded-xl text-white">
          <p><strong>Plan:</strong> {inv.plan_name}</p>
          <p><strong>Monto:</strong> {inv.amount} USDT</p>
          <p><strong>Ganancia acumulada:</strong> {inv.earned.toFixed(2)} USDT</p>
          <p><strong>Progreso:</strong> {(inv.progress * 100).toFixed(1)}%</p>
          <button
            className={`px-4 py-1 rounded mt-2 ${
              inv.progress < 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600'
            }`}
            onClick={() => handleClaim(inv.id)}
            disabled={inv.progress < 1}
          >
            {inv.progress < 1 ? 'Pendiente...' : 'Reclamar Ganancias'}
          </button>
        </div>
      ))}

      {investments.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-xl text-white">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default InvestmentDashboard;
