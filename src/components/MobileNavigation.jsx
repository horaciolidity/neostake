import React from 'react';
import { motion } from 'framer-motion';
import { Home, Droplet, Wallet, Gift, User, Shield } from 'lucide-react';

const MobileNavigation = ({ activeTab, setActiveTab, isAdmin }) => {
  const navItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'plans', name: 'Planes', icon: Droplet },
    { id: 'wallet', name: 'Cartera', icon: Wallet },
    { id: 'referrals', name: 'Referidos', icon: Gift },
    { id: 'profile', name: 'Perfil', icon: User },
    ...(isAdmin ? [{ id: 'admin', name: 'Admin', icon: Shield }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-gray-800 mobile-nav-shadow z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-1/6 ${
                isActive 
                  ? 'text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-green-400' : ''}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-400 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-green-400' : 'text-gray-400'
              }`}>
                {item.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
