import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import AuthScreen from '@/components/AuthScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import Dashboard from '@/components/Dashboard';
import InvestmentPlans from '@/components/InvestmentPlans';
import WalletSection from '@/components/WalletSection';
import ProfileSection from '@/components/ProfileSection';
import MobileNavigation from '@/components/MobileNavigation';
import ReferralSystem from '@/components/ReferralSystem';
import AdminPanel from '@/components/AdminPanel';
import { supabase } from '@/supabaseClient'; // Asegúrate de tener esto configurado

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [userBalance, setUserBalance] = useState({
    usdt: 0,
    btc: 0,
    eth: 0,
    usd: 0
  });

  const [coinPrices, setCoinPrices] = useState({
    bitcoin: { usd: 68000.50, usd_24h_change: 2.5 },
    ethereum: { usd: 3500.75, usd_24h_change: -1.2 },
    tether: { usd: 1.00, usd_24h_change: 0.01 },
  });

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setCoinPrices(prev => ({
        bitcoin: {
          usd: prev.bitcoin.usd + (Math.random() - 0.5) * 100,
          usd_24h_change: prev.bitcoin.usd_24h_change + (Math.random() - 0.5) * 0.1
        },
        ethereum: {
          usd: prev.ethereum.usd + (Math.random() - 0.5) * 50,
          usd_24h_change: prev.ethereum.usd_24h_change + (Math.random() - 0.5) * 0.1
        },
        tether: { usd: 1.00, usd_24h_change: 0.01 },
      }));
    }, 5000);
    return () => clearInterval(priceInterval);
  }, []);

  // ✅ Obtener perfil desde Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();
      if (error || !user) {
        setIsAuthenticated(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, balance_usdt, balance_btc, balance_eth, is_admin')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Error cargando perfil:', profileError);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser(profile);
      setUserBalance({
        usdt: Number(profile.balance_usdt || 0),
        btc: Number(profile.balance_btc || 0),
        eth: Number(profile.balance_eth || 0),
        usd: 0
      });

      if (localStorage.getItem('neoStakeWalletConnected') === 'true') {
        setIsWalletConnected(true);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const btcValue = userBalance.btc * coinPrices.bitcoin.usd;
      const ethValue = userBalance.eth * coinPrices.ethereum.usd;
      const totalUsd = userBalance.usdt + btcValue + ethValue;
      setUserBalance(prev => ({ ...prev, usd: totalUsd }));
    }
  }, [userBalance.usdt, userBalance.btc, userBalance.eth, coinPrices, currentUser]);

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
    localStorage.setItem('neoStakeWalletConnected', 'true');
  };

  const handleDisconnect = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsWalletConnected(false);
    setCurrentUser(null);
    localStorage.removeItem('neoStakeWalletConnected');
    setActiveTab('home');
  };

  const renderActiveSection = () => {
    if (!isWalletConnected) {
      return <WelcomeScreen onConnect={handleWalletConnect} userBalance={userBalance} />;
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard userBalance={userBalance} coinPrices={coinPrices} setActiveTab={setActiveTab} currentUser={currentUser} />;
      case 'plans':
        return <InvestmentPlans userBalance={userBalance} setUserBalance={setUserBalance} />;
      case 'wallet':
        return <WalletSection userBalance={userBalance} setUserBalance={setUserBalance} />;
      case 'referrals':
        return <ReferralSystem />;
      case 'profile':
        return <ProfileSection onDisconnect={handleDisconnect} userBalance={userBalance} />;
      case 'admin':
        return currentUser?.is_admin ? (
          <AdminPanel userBalance={userBalance} />
        ) : (
          <div className="p-4 text-center text-red-400">Acceso no autorizado</div>
        );
      default:
        return <Dashboard userBalance={userBalance} coinPrices={coinPrices} setActiveTab={setActiveTab} currentUser={currentUser} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>NeoStake - Iniciar Sesión</title>
          <meta name="description" content="Accede a tu cuenta de NeoStake para gestionar tus inversiones Web3." />
        </Helmet>
        <AuthScreen />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>NeoStake Dashboard - Tu Portal Web3</title>
        <meta name="description" content="Dashboard completo de NeoStake con staking, trading, proyectos Web3 y gestión de portfolio en tiempo real." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="pb-24 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + isWalletConnected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </div>

        {isWalletConnected && (
          <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={currentUser?.is_admin} />
        )}
        <Toaster />
      </div>
    </>
  );
}

export default App;
