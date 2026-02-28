import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, ArrowUpRight, ArrowDownLeft, Plus, X } from 'lucide-react';
import { Account, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DailyTransactionViewProps {
  accounts: Account[];
  transactions: Transaction[];
  onTransaction: (accountId: string, amount: number, type: 'income' | 'expense', note: string, date: string) => void;
}

export const DailyTransactionView: React.FC<DailyTransactionViewProps> = ({ accounts, transactions, onTransaction }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [note, setNote] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  const dailyTransactions = transactions.filter(t => t.date === date);
  const dailyIncome = dailyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const dailyExpense = dailyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!selectedAccountId || isNaN(numAmount) || numAmount <= 0) return;

    onTransaction(selectedAccountId, numAmount, type, note, date);
    
    setAmount('');
    setNote('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Daily Transactions</p>
          <div className="flex items-baseline space-x-2">
            <h1 className="text-4xl font-bold text-slate-900">${(dailyIncome - dailyExpense).toLocaleString()}</h1>
            <span className="text-xs text-slate-400 font-medium">Net for {date === new Date().toISOString().split('T')[0] ? 'Today' : date}</span>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      <section className="px-4">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-4">
          <Calendar className="text-indigo-600" size={20} />
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 focus:outline-none"
          />
        </div>
      </section>

      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Income</p>
          <p className="text-xl font-bold text-emerald-700">+${dailyIncome.toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Expense</p>
          <p className="text-xl font-bold text-rose-700">-${dailyExpense.toLocaleString()}</p>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4"
          >
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative">
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900 mb-4">New Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Credit (Cr)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Debit (Dr)
                  </button>
                </div>

                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number" 
                    placeholder="Amount" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Note / Description" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Account</label>
                  <select 
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-colors ${type === 'income' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'}`}
                >
                  Save Transaction
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="px-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Transactions for this day</h2>
        <div className="space-y-3">
          {dailyTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">No transactions recorded for this date.</p>
            </div>
          ) : (
            dailyTransactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">{tx.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {accounts.find(a => a.id === tx.accountId)?.name || 'Unknown Account'}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Overall Recent History</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 5</span>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="bg-white/50 rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">{tx.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {accounts.find(a => a.id === tx.accountId)?.name || 'Unknown Account'}
                  </p>
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
