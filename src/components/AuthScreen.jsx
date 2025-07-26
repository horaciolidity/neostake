import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, LogIn, Lock, UserPlus, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom'; // ✅ agregado

const AuthScreen = ({ onLogin }) => {
  const navigate = useNavigate(); // ✅ inicializado
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "❌ Email o contraseña vacíos", variant: "destructive" });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "❌ Error de autenticación",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "✅ ¡Bienvenido!", description: "Sesión iniciada correctamente." });
      onLogin?.(data.user.email);
      navigate('/dashboard'); // ✅ redirección automática
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      toast({ title: "❌ Completa todos los campos", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "❌ Las contraseñas no coinciden", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "❌ La contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast({
        title: "❌ Error al registrarse",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "✅ Registro exitoso",
        description: "Revisa tu email para confirmar tu cuenta.",
      });
      setIsLoginView(true);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail('');
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
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
            />
          </div>
          {!isLoginView && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
              />
            </div>
          )}
          <Button
            onClick={isLoginView ? handleLogin : handleRegister}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl cyber-glow transition-all duration-300"
          >
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
