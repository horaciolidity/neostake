import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ReferralSystem = () => {
  const referralCode = 'NEOSTAKE-A4B8C';
  const referralLink = `https://neostake.com/ref/${referralCode}`;
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const stats = {
    referrals: 12,
    earnings: 235.50,
    commission: '5%',
  };

  const rewards = [
    { level: 'Nivel 1', referrals: 5, reward: '10 USDT', claimed: true },
    { level: 'Nivel 2', referrals: 10, reward: '25 USDT', claimed: true },
    { level: 'Nivel 3', referrals: 25, reward: '75 USDT', claimed: false },
    { level: 'Nivel 4', referrals: 50, reward: '200 USDT', claimed: false },
  ];

  const handleCopy = (type) => {
    if (type === 'code') {
      navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      toast({ title: "✅ Código copiado" });
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast({ title: "✅ Enlace copiado" });
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };
  
  const handleClaimReward = (reward) => {
     toast({
      title: "🚧 Función no implementada aún",
      description: `La reclamación para ${reward.level} no está disponible todavía.`,
    });
  }

  return (
    <div className="p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Sistema de Referidos</h1>
        <p className="text-gray-400">Invita amigos y gana recompensas por cada referido.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl text-center"
      >
        <Gift className="w-10 h-10 text-purple-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Invita a un amigo</h2>
        <p className="text-sm text-gray-300 mb-4">
          Tú y tu amigo recibirán una bonificación cuando se registren e inviertan con tu enlace.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">Tu Código de Referido</label>
            <div className="flex items-center bg-gray-800/50 p-2 rounded-lg mt-1">
              <p className="flex-1 font-mono text-purple-400">{referralCode}</p>
              <Button size="sm" variant="ghost" onClick={() => handleCopy('code')}>
                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400">Tu Enlace de Referido</label>
            <div className="flex items-center bg-gray-800/50 p-2 rounded-lg mt-1">
              <p className="flex-1 font-mono text-purple-400 truncate text-sm">{referralLink}</p>
              <Button size="sm" variant="ghost" onClick={() => handleCopy('link')}>
                {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 text-center"
      >
        <div className="glass-card p-3 rounded-lg">
          <Users className="w-5 h-5 mx-auto text-blue-400 mb-1" />
          <p className="font-bold">{stats.referrals}</p>
          <p className="text-xs text-gray-400">Referidos</p>
        </div>
        <div className="glass-card p-3 rounded-lg">
          <DollarSign className="w-5 h-5 mx-auto text-green-400 mb-1" />
          <p className="font-bold">${stats.earnings.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Ganancias</p>
        </div>
        <div className="glass-card p-3 rounded-lg">
          <p className="text-xl font-bold text-purple-400">{stats.commission}</p>
          <p className="text-xs text-gray-400">Comisión</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Premios por Nivel</h3>
        <div className="space-y-3">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className={`glass-card p-4 rounded-xl flex items-center justify-between ${reward.claimed ? 'opacity-60' : ''}`}
            >
              <div>
                <p className="font-bold">{reward.level}</p>
                <p className="text-sm text-gray-400">{reward.referrals} referidos para desbloquear</p>
                <p className="text-sm font-bold text-green-400">Recompensa: {reward.reward}</p>
              </div>
              <Button
                size="sm"
                disabled={reward.claimed || stats.referrals < reward.referrals}
                onClick={() => handleClaimReward(reward)}
                className={reward.claimed ? "bg-gray-500/20 text-gray-400" : "bg-green-500/20 text-green-400"}
              >
                {reward.claimed ? 'Reclamado' : 'Reclamar'}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralSystem;