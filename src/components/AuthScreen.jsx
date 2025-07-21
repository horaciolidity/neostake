import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, LogIn, User, Lock, UserPlus, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AuthScreen = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('neoStakeUsers')) || {};
    if (!users['robert2323']) {
      users['robert2323'] = {
        password: 'victoria1986',
        balance: { usdt: 6444.00, btc: 0.1, eth: 0, usd: 6444.00 + (0.1 * 68000.50) },
        transactions: []
      };
      localStorage.setItem('neoStakeUsers', JSON.stringify(users));
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('neoStakeUsers')) || {};
    if (users[username] && users[username].password === password) {
      toast({
        title: "✅ ¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
      });
      onLogin(username);
    } else {
      toast({
        title: "❌ Error de Autenticación",
        description: "Usuario o contraseña incorrectos.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      toast({ title: "❌ Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    if (!username || !password) {
      toast({ title: "❌ Campos requeridos", description: "Usuario y contraseña son obligatorios.", variant: "destructive" });
      return;
    }

    const users = JSON.parse(localStorage.getItem('neoStakeUsers')) || {};
    if (users[username]) {
      toast({ title: "❌ Usuario ya existe", description: "Elige otro nombre de usuario.", variant: "destructive" });
      return;
    }

    users[username] = {
      password: password,
      balance: { usdt: 0, btc: 0, eth: 0, usd: 0 },
      transactions: []
    };
    localStorage.setItem('neoStakeUsers', JSON.stringify(users));
    toast({ title: "✅ ¡Registro exitoso!", description: "Ahora puedes iniciar sesión." });
    setIsLoginView(true);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <motion.div
        key={isLoginView ? 'login' : 'register'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 relative z-10 max-w-sm w-full mx-auto"
      >
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center cyber-glow">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2 neon-text">NeoStake</h1>
          <p className="text-lg text-gray-300">{isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-12 pl-10 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 pl-10 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none" />
          </div>
          {!isLoginView && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-12 pl-10 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none" />
            </div>
          )}
          <Button onClick={isLoginView ? handleLogin : handleRegister} className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl cyber-glow transition-all duration-300">
            {isLoginView ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
            {isLoginView ? 'Acceder' : 'Registrarse'}
          </Button>
        </div>

        <p className="text-sm text-gray-400">
          {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <Button variant="link" onClick={toggleView} className="text-green-400 hover:text-green-300">
            {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
          </Button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthScreen;