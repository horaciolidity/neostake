import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wallet, Shield, TrendingUp, Zap, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const WelcomeScreen = ({ onConnect, onLogout }) => {
  const handleConnectWallet = () => {
    toast({
      title: "🚀 Wallet Conectado",
      description: "¡Bienvenido a NeoStake! Tu wallet se ha conectado exitosamente.",
    });
    setTimeout(() => {
      onConnect();
    }, 1000);
  };

  const handleKYC = () => {
    toast({
      title: "🚧 KYC no implementado aún",
      description: "¡No te preocupes! Puedes solicitarlo en tu próximo prompt! 🚀",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 relative z-10 max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center cyber-glow">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-30 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold mb-2 neon-text">NeoStake</h1>
          <p className="text-lg text-gray-300">Plataforma de Inversión Web3</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300"
        >
          ¡Has iniciado sesión! Ahora, conecta tu wallet para empezar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <Button
            onClick={handleConnectWallet}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl cyber-glow transition-all duration-300"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Conectar Wallet
          </Button>
          
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-400 mt-8"
        >
          Conecta tu wallet para acceder al futuro de las finanzas descentralizadas.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;