import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, X, Trash2 } from 'lucide-react';
import { Account, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CashViewProps {
  accounts: Account[];
  recentTransactions: Transaction[];
  onAddAccount: (account: Omit<Account, 'id'>) => void;
  onDeleteAccount: (accountId: string) => void;
  onTransaction: (accountId: string, amount: number, type: 'income' | 'expense', note: string) => void;
}

interface AccountCardProps {
  acc: Account;
  onDelete: (accountId: string) => void;
  onTransaction: (accountId: string, amount: number, type: 'income' | 'expense', note: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ acc, onDelete, onTransaction }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleAction = (type: 'income' | 'expense') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    onTransaction(acc.id, numAmount, type, note);
    setAmount('');
    setNote('');
  };

  return (
    <div className="bg-indigo-600 rounded-3xl p-4 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between min-h-[180px]">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Wallet size={14} />
          </div>
          <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">{acc.type}</span>
        </div>
        <button 
          onClick={() => onDelete(acc.id)}
          className="text-white/40 hover:text-rose-300 transition-colors p-1"
          title="Delete Account"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="mb-3">
        <p className="text-[9px] opacity-80 mb-0.5 truncate font-medium">{acc.name}</p>
        <p className="text-base font-bold">${acc.balance.toLocaleString()}</p>
      </div>

      <div className="space-y-2">
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg py-1 px-2 text-[10px] placeholder:text-white/40 focus:outline-none focus:bg-white/20"
        />
        <input 
          type="text" 
          placeholder="Note" 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg py-1 px-2 text-[10px] placeholder:text-white/40 focus:outline-none focus:bg-white/20"
        />
        <div className="flex space-x-1">
          <button 
            onClick={() => handleAction('income')}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold py-1 rounded-lg transition-colors"
          >
            Cr
          </button>
          <button 
            onClick={() => handleAction('expense')}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-[10px] font-bold py-1 rounded-lg transition-colors"
          >
            Dr
          </button>
        </div>
      </div>
    </div>
  );
};

export const CashView: React.FC<CashViewProps> = ({ accounts, recentTransactions, onAddAccount, onDeleteAccount, onTransaction }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newType, setNewType] = useState<Account['type']>('cash');

  const totalCash = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBalance) return;
    
    onAddAccount({
      name: newName,
      balance: parseFloat(newBalance),
      type: newType
    });
    
    setNewName('');
    setNewBalance('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Available Cash</p>
          <h1 className="text-4xl font-bold text-slate-900">${totalCash.toLocaleString()}</h1>
        </div>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="px-4"
          >
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative">
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Account</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Travel Fund"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Initial Balance</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Type</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Account['type'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                >
                  Create Account
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} acc={acc} onDelete={onDeleteAccount} onTransaction={onTransaction} />
          ))}
          
          {/* Add New Account Card */}
          <button 
            onClick={() => setIsAdding(true)}
            className="border-2 border-dashed border-slate-200 rounded-3xl p-5 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center min-h-[180px] space-y-2"
          >
            <div className="bg-slate-100 p-2 rounded-full">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Account</span>
          </button>
        </div>
      </section>

      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
          <button className="text-xs font-medium text-indigo-600">View All</button>
        </div>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          {recentTransactions.slice(0, 5).map((tx, idx) => (
            <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== 4 ? 'border-bottom border-slate-50' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                  <p className="text-xs text-slate-400">{tx.category}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
