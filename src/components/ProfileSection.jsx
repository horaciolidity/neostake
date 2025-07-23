import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, HelpCircle, LogOut, Edit, Copy, Award, TrendingUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ProfileSection = ({ onDisconnect, userBalance, transactionHistory }) => {
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const initProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');
        let referrerId = null;

        if (refCode) {
          const { data: refProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', refCode)
            .single();

          if (refProfile) referrerId = refProfile.id;
        }

        const referralCode = `NEOSTAKE-${user.id.substring(0, 6)}`;

        await supabase.from('profiles').insert({
          id: user.id,
          balance_usdt: 0,
          balance_eth: 0,
          referrer_id: referrerId,
          referral_code: referralCode,
        });

        if (referrerId) {
          await supabase.from('referrals').insert({
            user_id: referrerId,
            referred_id: user.id,
          });
        }
      }
    };

    initProfile();
  }, []);

  const userStats = {
    totalInvested: '$0.00',
    totalReturns: '$0.00',
    referrals: 0,
    nftCount: 0,
    level: 'Inversor Nivel 1'
  };

  const achievements = [
    { id: 1, name: 'Primer Stake', icon: '🎯', earned: false },
    { id: 2, name: 'Hodler', icon: '💎', earned: false },
    { id: 3, name: 'Diversificado', icon: '🌟', earned: false },
    { id: 4, name: 'Ballena', icon: '🐋', earned: false },
  ];

  const walletAddress = '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "📋 Dirección copiada",
      description: "La dirección de tu wallet ha sido copiada al portapapeles.",
    });
  };

  const handleEditProfile = () => {
    toast({
      title: "🚧 Edición de perfil no implementada aún",
      description: "¡No te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  const handleSettings = (setting) => {
    toast({
      title: `🚧 ${setting} no implementado aún`,
      description: "¡No te preocupes! Puedes solicitarlo en tu próximo prompt! 🚀",
    });
  };

  const handleDisconnectWallet = () => {
    toast({
      title: "👋 Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    setTimeout(() => {
      onDisconnect();
    }, 1000);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2">Usuario NeoStake</h2>
        <p className="text-gray-400 mb-4">{userStats.level}</p>

        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-gray-400 font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAddress}
            className="text-gray-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleEditProfile}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="glass-card p-4 rounded-xl text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-lg font-bold">${userBalance.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-400">Balance Total</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <Award className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-lg font-bold">{userStats.totalReturns}</p>
          <p className="text-sm text-gray-400">Retornos Totales</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Logros</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`glass-card p-3 rounded-xl text-center ${achievement.earned ? 'border-green-500/30' : 'opacity-50'}`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <p className="font-medium text-sm">{achievement.name}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Historial de Transacciones</h3>
      {transactionHistory && transactionHistory.length > 0 ? (
        transactionHistory.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${tx.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <div>
                  <p className="font-medium capitalize">{tx.type}</p>
                  <p className="text-sm text-gray-400">{tx.project}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{tx.amount}</p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-400 py-8">No hay transacciones todavía.</p>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Configuración</h3>

      <div className="space-y-3">
        <Button onClick={() => handleSettings('Notificaciones')} variant="ghost" className="w-full justify-start text-left p-4 h-auto glass-card rounded-xl">
          <Bell className="w-5 h-5 mr-3" />
          <div>
            <p className="font-medium">Notificaciones</p>
            <p className="text-sm text-gray-400">Gestiona tus alertas y notificaciones</p>
          </div>
        </Button>
        <Button onClick={() => handleSettings('Seguridad')} variant="ghost" className="w-full justify-start text-left p-4 h-auto glass-card rounded-xl">
          <Shield className="w-5 h-5 mr-3" />
          <div>
            <p className="font-medium">Seguridad</p>
            <p className="text-sm text-gray-400">Configuración de seguridad y 2FA</p>
          </div>
        </Button>
        <Button onClick={() => handleSettings('Ayuda')} variant="ghost" className="w-full justify-start text-left p-4 h-auto glass-card rounded-xl">
          <HelpCircle className="w-5 h-5 mr-3" />
          <div>
            <p className="font-medium">Ayuda y Soporte</p>
            <p className="text-sm text-gray-400">Centro de ayuda y contacto</p>
          </div>
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <Button onClick={handleDisconnectWallet} variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-gray-400">Gestiona tu cuenta y configuración</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex space-x-2">
        {[
          { id: 'profile', name: 'Perfil', icon: User },
          { id: 'history', name: 'Historial', icon: History },
          { id: 'settings', name: 'Ajustes', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 ${activeTab === tab.id ? 'bg-green-500 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {tab.name}
            </Button>
          );
        })}
      </motion.div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </motion.div>
    </div>
  );
};

export default ProfileSection;
