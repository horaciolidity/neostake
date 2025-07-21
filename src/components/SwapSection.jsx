
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, TrendingUp, TrendingDown, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SwapSection = ({ userBalance, setUserBalance }) => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 2456.78, change: 5.2, icon: '🔷' },
    { symbol: 'BTC', name: 'Bitcoin', price: 43567.89, change: -2.1, icon: '₿' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.0, icon: '💵' },
    { symbol: 'USDT', name: 'Tether', price: 0.999, change: 0.1, icon: '💰' },
    { symbol: 'BNB', name: 'BNB', price: 312.45, change: 3.8, icon: '🟡' },
    { symbol: 'ADA', name: 'Cardano', price: 0.487, change: 7.2, icon: '🔵' },
  ];

  const recentTrades = [
    { pair: 'ETH/USDC', amount: '1.5 ETH', price: '$2,456.78', time: '2m ago', type: 'buy' },
    { pair: 'BTC/USDT', amount: '0.05 BTC', price: '$43,567.89', time: '5m ago', type: 'sell' },
    { pair: 'BNB/USDC', amount: '10 BNB', price: '$312.45', time: '8m ago', type: 'buy' },
  ];

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulate real-time price data
    const generateChartData = () => {
      const data = [];
      const basePrice = tokens.find(t => t.symbol === fromToken)?.price || 2456;
      
      for (let i = 0; i < 24; i++) {
        data.push({
          time: i,
          price: basePrice + (Math.random() - 0.5) * 100,
          volume: Math.random() * 1000000
        });
      }
      setChartData(data);
    };

    generateChartData();
    const interval = setInterval(generateChartData, 5000);
    return () => clearInterval(interval);
  }, [fromToken]);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const fromPrice = tokens.find(t => t.symbol === fromToken)?.price || 0;
      const toPrice = tokens.find(t => t.symbol === toToken)?.price || 0;
      const calculated = (parseFloat(fromAmount) * fromPrice / toPrice).toFixed(6);
      setToAmount(calculated);
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "❌ Cantidad inválida",
        description: "Por favor ingresa una cantidad válida para el intercambio.",
      });
      return;
    }

    toast({
      title: "🔄 Swap Ejecutado",
      description: `Has intercambiado ${fromAmount} ${fromToken} por ${toAmount} ${toToken}`,
    });
    
    setFromAmount('');
    setToAmount('');
  };

  const handleOrderSubmit = () => {
    const orderTypeText = orderType === 'market' ? 'Market' : orderType === 'limit' ? 'Limit' : 'OCO';
    toast({
      title: `📊 Orden ${orderTypeText} Creada`,
      description: `Tu orden de ${orderType} ha sido enviada al libro de órdenes.`,
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
        <h1 className="text-2xl font-bold">Trading</h1>
        <p className="text-gray-400">Intercambia criptomonedas en tiempo real</p>
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{tokens.find(t => t.symbol === fromToken)?.icon}</span>
            <div>
              <p className="font-bold">{fromToken}/USDC</p>
              <p className="text-sm text-gray-400">
                ${tokens.find(t => t.symbol === fromToken)?.price.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">En vivo</span>
          </div>
        </div>
        
        {/* Simulated Chart */}
        <div className="h-32 trading-grid rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
            {chartData.slice(0, 12).map((point, index) => (
              <div
                key={index}
                className="w-2 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                style={{ height: `${(point.price / Math.max(...chartData.map(d => d.price))) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Swap Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 rounded-xl space-y-4"
      >
        <h2 className="text-lg font-semibold">Intercambio Rápido</h2>
        
        {/* From Token */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Desde</label>
          <div className="flex space-x-2">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
            >
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSwapTokens}
            variant="ghost"
            size="sm"
            className="rounded-full p-2 hover:bg-gray-700"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Hacia</label>
          <div className="flex space-x-2">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
            >
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="flex-1 bg-gray-800/30 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-400"
            />
          </div>
        </div>

        <Button
          onClick={handleSwap}
          className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl"
        >
          Intercambiar
        </Button>
      </motion.div>

      {/* Order Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 rounded-xl space-y-4"
      >
        <h2 className="text-lg font-semibold">Tipos de Orden</h2>
        
        <div className="flex space-x-2">
          {['market', 'limit', 'oco'].map((type) => (
            <Button
              key={type}
              onClick={() => setOrderType(type)}
              variant={orderType === type ? 'default' : 'outline'}
              size="sm"
              className={`flex-1 ${orderType === type 
                ? 'bg-green-500 text-white' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
            >
              {type.toUpperCase()}
            </Button>
          ))}
        </div>

        {orderType === 'limit' && (
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Precio Límite</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="Precio en USDC"
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
            />
          </div>
        )}

        <Button
          onClick={handleOrderSubmit}
          className="w-full h-10 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Crear Orden
        </Button>
      </motion.div>

      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Mercado</h2>
        <div className="space-y-2">
          {tokens.slice(0, 4).map((token, index) => (
            <div key={token.symbol} className="glass-card p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{token.icon}</span>
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-xs text-gray-400">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${token.price.toLocaleString()}</p>
                  <div className={`flex items-center space-x-1 text-xs ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{token.change >= 0 ? '+' : ''}{token.change}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Trades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold">Operaciones Recientes</h2>
        <div className="space-y-2">
          {recentTrades.map((trade, index) => (
            <div key={index} className="glass-card p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{trade.pair}</p>
                  <p className="text-sm text-gray-400">{trade.amount}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{trade.price}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {trade.type === 'buy' ? 'Compra' : 'Venta'}
                    </span>
                    <span className="text-xs text-gray-400">{trade.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SwapSection;
