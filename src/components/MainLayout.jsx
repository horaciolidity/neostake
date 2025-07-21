import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';
import InvestmentPlans from '@/components/InvestmentPlans';
import WalletSection from '@/components/WalletSection';
import ProfileSection from '@/components/ProfileSection';
import MobileNavigation from '@/components/MobileNavigation';
import ReferralSystem from '@/components/ReferralSystem';

const MainLayout = ({ userBalance, setUserBalance, onDisconnect }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [coinPrices, setCoinPrices] = useState({
    bitcoin: { usd: 68000.50, usd_24h_change: 2.5 },
    ethereum: { usd: 3500.75, usd_24h_change: -1.2 },
    tether: { usd: 1.00, usd_24h_change: 0.01 },
  });

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setCoinPrices(prevPrices => ({
        bitcoin: { 
          usd: prevPrices.bitcoin.usd + (Math.random() - 0.5) * 100,
          usd_24h_change: prevPrices.bitcoin.usd_24h_change + (Math.random() - 0.5) * 0.1
        },
        ethereum: { 
          usd: prevPrices.ethereum.usd + (Math.random() - 0.5) * 50,
          usd_24h_change: prevPrices.ethereum.usd_24h_change + (Math.random() - 0.5) * 0.1
        },
        tether: { usd: 1.00, usd_24h_change: 0.01 },
      }));
    }, 5000);
    return () => clearInterval(priceInterval);
  }, []);

  useEffect(() => {
    const btcValue = userBalance.btc * coinPrices.bitcoin.usd;
    const ethValue = userBalance.eth * coinPrices.ethereum.usd;
    const totalUsd = userBalance.usdt + btcValue + ethValue;
    setUserBalance(prev => ({...prev, usd: totalUsd}));
  }, [userBalance.usdt, userBalance.btc, userBalance.eth, coinPrices, setUserBalance]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard userBalance={userBalance} coinPrices={coinPrices} setActiveTab={setActiveTab} />;
      case 'plans':
        return <InvestmentPlans userBalance={userBalance} setUserBalance={setUserBalance} />;
      case 'wallet':
        return <WalletSection userBalance={userBalance} setUserBalance={setUserBalance} />;
      case 'referrals':
        return <ReferralSystem />;
      case 'profile':
        return <ProfileSection onDisconnect={onDisconnect} userBalance={userBalance} />;
      default:
        return <Dashboard userBalance={userBalance} coinPrices={coinPrices} setActiveTab={setActiveTab} />;
    }
  };

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
              key={activeTab}
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
        
        <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <Toaster />
      </div>
    </>
  );
};

export default MainLayout;