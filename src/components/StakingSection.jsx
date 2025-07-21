
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Coins, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const StakingSection = ({ userBalance, setUserBalance }) => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const stakingPools = [
    {
      id: 1,
      name: 'ETH 2.0',
      token: 'ETH',
      apr: '5.2%',
      tvl: '$2.4B',
      minStake: '0.1',
      risk: 'Bajo',
      lockPeriod: '30 días',
      rewards: 'ETH',
      icon: '🔷'
    },
    {
      id: 2,
      name: 'USDC Stable',
      token: 'USDC',
      apr: '8.5%',
      tvl: '$890M',
      minStake: '100',
      risk: 'Muy Bajo',
      lockPeriod: '7 días',
      rewards: 'USDC',
      icon: '💵'
    },
    {
      id: 3,
      name: 'BTC Vault',
      token: 'BTC',
      apr: '4.8%',
      tvl: '$1.2B',
      minStake: '0.01',
      risk: 'Bajo',
      lockPeriod: '90 días',
      rewards: 'BTC',
      icon: '₿'
    },
    {
      id: 4,
      name: 'DeFi Boost',
      token: 'MULTI',
      apr: '15.7%',
      tvl: '$156M',
      minStake: '1000',
      risk: 'Alto',
      lockPeriod: '180 días',
      rewards: 'MULTI',
      icon: '🚀'
    }
  ];

  const userStakes = [
    {
      pool: 'ETH 2.0',
      amount: '2.5 ETH',
      rewards: '0.0234 ETH',
      timeLeft: '23 días',
      status: 'active'
    },
    {
      pool: 'USDC Stable',
      amount: '5,000 USDC',
      rewards: '45.67 USDC',
      timeLeft: 'Disponible',
      status: 'claimable'
    }
  ];

  const handleStake = (pool) => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "❌ Cantidad inválida",
        description: "Por favor ingresa una cantidad válida para hacer staking.",
      });
      return;
    }

    toast({
      title: "🚀 Staking Iniciado",
      description: `Has iniciado staking de ${stakeAmount} ${pool.token} en ${pool.name}`,
    });
    
    setStakeAmount('');
    setSelectedPool(null);
  };

  const handleUnstake = (stake) => {
    toast({
      title: "⏳ Unstaking Procesado",
      description: `Tu ${stake.amount} será liberado según el período de bloqueo.`,
    });
  };

  const handleClaim = (stake) => {
    toast({
      title: "💰 Recompensas Reclamadas",
      description: `Has reclamado ${stake.rewards} exitosamente.`,
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-bold">Staking</h1>
        <p className="text-gray-400">Gana recompensas con tus criptomonedas</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="glass-card p-4 rounded-xl text-center">
          <Coins className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-lg font-bold">$8,450</p>
          <p className="text-sm text-gray-400">Total en Staking</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-lg font-bold">$234.56</p>
          <p className="text-sm text-gray-400">Recompensas Totales</p>
        </div>
      </motion.div>

      {/* Your Stakes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Tus Stakes</h2>
        {userStakes.map((stake, index) => (
          <div key={index} className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{stake.pool}</p>
                <p className="text-sm text-gray-400">{stake.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">{stake.rewards}</p>
                <p className="text-xs text-gray-400">{stake.timeLeft}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleUnstake(stake)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Minus className="w-4 h-4 mr-1" />
                Unstake
              </Button>
              <Button
                size="sm"
                onClick={() => handleClaim(stake)}
                className={`flex-1 ${stake.status === 'claimable' 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400'}`}
                disabled={stake.status !== 'claimable'}
              >
                Claim
              </Button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Available Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Pools Disponibles</h2>
        <div className="space-y-3">
          {stakingPools.map((pool) => (
            <motion.div
              key={pool.id}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4 rounded-xl cursor-pointer"
              onClick={() => setSelectedPool(pool)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{pool.icon}</span>
                  <div>
                    <p className="font-medium">{pool.name}</p>
                    <p className="text-sm text-gray-400">{pool.token}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">{pool.apr}</p>
                  <p className="text-xs text-gray-400">APR</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                <div>
                  <p>TVL: {pool.tvl}</p>
                </div>
                <div>
                  <p>Min: {pool.minStake} {pool.token}</p>
                </div>
                <div>
                  <p>Riesgo: {pool.risk}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{pool.lockPeriod}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Stake
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stake Modal */}
      {selectedPool && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPool(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 rounded-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <span className="text-4xl">{selectedPool.icon}</span>
              <h3 className="text-xl font-bold mt-2">{selectedPool.name}</h3>
              <p className="text-green-400 text-lg font-bold">{selectedPool.apr} APR</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Cantidad a hacer staking
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder={`Min: ${selectedPool.minStake} ${selectedPool.token}`}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                />
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>• Período de bloqueo: {selectedPool.lockPeriod}</p>
                <p>• Recompensas en: {selectedPool.rewards}</p>
                <p>• Nivel de riesgo: {selectedPool.risk}</p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => setSelectedPool(null)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleStake(selectedPool)}
                >
                  Confirmar Stake
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StakingSection;
