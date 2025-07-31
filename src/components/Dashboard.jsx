import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WalletPanel from './WalletPanel';
import AdminRechargePanel from './AdminRechargePanel';

const Dashboard = ({ userBalance, coinPrices, setActiveTab, currentUser }) => {
  const [showBalance, setShowBalance] = React.useState(true);

  const stats = [
    {
      label: 'Ganancias 24h',
      value: `$${userBalance.usdt > 0 ? (userBalance.usdt * 0.03).toFixed(2) : '0.00'}`,
      change: userBalance.usdt > 0 ? '+3.0%' : '0%',
      positive: userBalance.usdt > 0
    },
    {
      label: 'Inversiones Activas',
      value: `$${userBalance.usdt.toFixed(2)}`,
      change: userBalance.usdt > 0 ? '+12.8%' : '0%',
      positive: userBalance.usdt > 0
    },
    {
      label: 'Recompensas',
      value: `$${userBalance.usdt > 0 ? (userBalance.usdt * 0.015).toFixed(2) : '0.00'}`,
      change: userBalance.usdt > 0 ? 'Reclamar' : '-',
      positive: userBalance.usdt > 0
    }
  ];

  const marketData = [
    { name: 'Bitcoin', symbol: 'BTC', price: coinPrices.bitcoin.usd, change: coinPrices.bitcoin.usd_24h_change, icon: '₿' },
    { name: 'Ethereum', symbol: 'ETH', price: coinPrices.ethereum.usd, change: coinPrices.ethereum.usd_24h_change, icon: '🔷' },
    { name: 'Tether', symbol: 'USDT', price: coinPrices.tether.usd, change: coinPrices.tether.usd_24h_change, icon: '💵' },
  ];

  return (
    <div className="p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Bienvenido de vuelta, {currentUser?.full_name || 'Usuario'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-400">Conectado</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl gradient-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-300">Balance Total (USD)</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 hover:text-white"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-bold neon-text">
            {showBalance ? `$${userBalance.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
          </div>
          <div className="flex space-x-4 text-sm text-gray-400">
            <span>{showBalance ? `$${userBalance.usdt.toFixed(2)} USDT` : '•••• USDT'}</span>
            <span>{showBalance ? `$${userBalance.btc.toFixed(6)} BTC` : '•••• BTC'}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button
          onClick={() => setActiveTab('wallet')}
          className="h-12 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl"
        >
          Depositar
        </Button>
        <Button
          onClick={() => setActiveTab('wallet')}
          variant="outline"
          className="h-12 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl"
        >
          Retirar
        </Button>
      </motion.div>

      {/* Paneles de integración Supabase */}
      <WalletPanel user={currentUser} />
      <AdminRechargePanel />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4 rounded-xl cursor-pointer"
        onClick={() => setActiveTab('plans')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Planes de Inversión</h3>
              <p className="text-sm text-gray-400">Gana hasta 30% APY</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Mercado en Tiempo Real</h3>
        <div className="space-y-2">
          {marketData.map((coin) => (
            <div key={coin.symbol} className="glass-card p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{coin.icon}</span>
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-xs text-gray-400">{coin.symbol}</p>
                  </div>
                </div>
                <div className={`flex items-center justify-end text-xs space-x-1 ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{coin.change.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
