import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, TrendingUp, Zap, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const InvestmentPlans = ({ userBalance, setUserBalance }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const plans = [
    {
      id: 1,
      name: 'Plan Alfa',
      apy: '12%',
      duration: '30 días',
      min: 100,
      max: 1000,
      risk: 'Bajo',
      color: 'blue',
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      features: ['Capital asegurado', 'Retorno estable', 'Ideal para empezar'],
    },
    {
      id: 2,
      name: 'Plan Beta',
      apy: '20%',
      duration: '60 días',
      min: 1001,
      max: 5000,
      risk: 'Medio',
      color: 'green',
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      features: ['Mayor APY', 'Acceso a proyectos DeFi', 'Recompensas semanales'],
    },
    {
      id: 3,
      name: 'Plan Gamma',
      apy: '30%',
      duration: '90 días',
      min: 5001,
      max: 20000,
      risk: 'Alto',
      color: 'purple',
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      features: ['Máximo retorno', 'Acceso exclusivo a pools', 'Asesoría personalizada'],
    },
  ];

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    if (!amount || amount <= 0) {
      toast({ title: "❌ Cantidad inválida", description: "Por favor, ingresa una cantidad válida." });
      return;
    }
    if (amount < selectedPlan.min || amount > selectedPlan.max) {
      toast({ title: "❌ Fuera de rango", description: `La inversión debe ser entre ${selectedPlan.min} y ${selectedPlan.max} USDT.` });
      return;
    }
    if (amount > userBalance.usdt) {
      toast({ title: "saldo insuficiente", description: "No tienes suficiente USDT para esta inversión." });
      return;
    }

    setUserBalance(prev => ({ ...prev, usdt: prev.usdt - amount, usd: prev.usd - amount }));
    toast({
      title: "🚀 ¡Inversión Exitosa!",
      description: `Has invertido ${amount} USDT en el ${selectedPlan.name}.`,
    });
    setSelectedPlan(null);
    setInvestmentAmount('');
  };

  const getPlanColor = (color) => {
    if (color === 'blue') return 'border-blue-500/50 hover:border-blue-500';
    if (color === 'green') return 'border-green-500/50 hover:border-green-500';
    if (color === 'purple') return 'border-purple-500/50 hover:border-purple-500';
  };

  return (
    <div className="p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Planes de Inversión</h1>
        <p className="text-gray-400">Maximiza tus ganancias con nuestros planes de inversión en USDT.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-xl text-center"
      >
        <p className="text-sm text-gray-400">Tu balance de USDT</p>
        <p className="text-2xl font-bold neon-text">{userBalance.usdt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT</p>
      </motion.div>

      <div className="space-y-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`glass-card p-4 rounded-xl border-2 ${getPlanColor(plan.color)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {plan.icon}
                <h3 className="text-lg font-bold">{plan.name}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full bg-${plan.color}-500/20 text-${plan.color}-400`}>Riesgo {plan.risk}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className={`text-2xl font-bold text-${plan.color}-400`}>{plan.apy}</p>
                <p className="text-xs text-gray-400">APY</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{plan.duration}</p>
                <p className="text-xs text-gray-400">Duración</p>
              </div>
            </div>
            <ul className="text-sm space-y-2 mb-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className={`w-4 h-4 text-${plan.color}-400`} />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mb-4">Inversión: {plan.min} - {plan.max} USDT</p>
            <Button
              onClick={() => setSelectedPlan(plan)}
              className={`w-full bg-${plan.color}-500/20 text-${plan.color}-400 hover:bg-${plan.color}-500/30`}
            >
              Invertir Ahora
            </Button>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPlan(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 rounded-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              {selectedPlan.icon}
              <h3 className="text-xl font-bold mt-2">{selectedPlan.name}</h3>
              <p className={`text-lg font-bold text-${selectedPlan.color}-400`}>{selectedPlan.apy} APY</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Cantidad a invertir (USDT)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Min: ${selectedPlan.min} / Max: ${selectedPlan.max}`}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Balance: {userBalance.usdt.toFixed(2)} USDT</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300" onClick={() => setSelectedPlan(null)}>Cancelar</Button>
                <Button className={`flex-1 bg-${selectedPlan.color}-500 hover:bg-${selectedPlan.color}-600 text-white`} onClick={handleInvest}>Confirmar Inversión</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InvestmentPlans;