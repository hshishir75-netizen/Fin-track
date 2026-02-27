import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Plus, X, Calendar, User, DollarSign, FileText, ArrowRightLeft } from 'lucide-react';
import { Receivable, Account } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ReceivablesViewProps {
  receivables: Receivable[];
  accounts: Account[];
  onAddReceivable: (receivable: Omit<Receivable, 'id'>) => void;
  onReceive: (receivableId: string, accountId: string, amount: number) => void;
}

export const ReceivablesView: React.FC<ReceivablesViewProps> = ({ receivables, accounts, onAddReceivable, onReceive }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  
  const [receivingId, setReceivingId] = useState<string | null>(null);
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');

  const totalPending = receivables
    .filter(r => r.status !== 'received')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !date) return;

    onAddReceivable({
      from: name,
      amount: parseFloat(amount),
      dueDate: date,
      status: 'pending',
      note: note
    });

    setName('');
    setAmount('');
    setDate('');
    setNote('');
    setIsAdding(false);
  };

  const handleReceive = (receivableId: string) => {
    const amount = parseFloat(receiveAmount);
    if (!selectedAccountId || isNaN(amount) || amount <= 0) return;
    onReceive(receivableId, selectedAccountId, amount);
    setReceivingId(null);
    setReceiveAmount('');
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Cash Receivable</p>
          <h1 className="text-4xl font-bold text-slate-900">${totalPending.toLocaleString()}</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4"
          >
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative">
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold text-slate-900 mb-4">New Receivable</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="From Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
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
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                  <textarea 
                    placeholder="Note (optional)" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[80px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                >
                  Add Entry
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="px-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">All Receivables</h2>
        <div className="space-y-3">
          {receivables.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${
                    r.status === 'received' ? 'bg-emerald-50 text-emerald-600' : 
                    r.status === 'overdue' ? 'bg-rose-50 text-rose-600' : 
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {r.status === 'received' ? <CheckCircle2 size={18} /> : 
                     r.status === 'overdue' ? <AlertCircle size={18} /> : 
                     <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{r.from}</p>
                    <p className="text-xs text-slate-400">Due {r.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">${r.amount.toLocaleString()}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-tighter ${
                    r.status === 'received' ? 'text-emerald-500' : 
                    r.status === 'overdue' ? 'text-rose-500' : 
                    'text-amber-500'
                  }`}>{r.status}</p>
                </div>
              </div>
              
              {r.note && (
                <div className="mt-2 pt-2 border-t border-slate-50">
                  <p className="text-xs text-slate-500 italic">"{r.note}"</p>
                </div>
              )}

              {r.status !== 'received' && (
                <div className="mt-4 pt-3 border-t border-slate-50">
                  {receivingId === r.id ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to Receive</label>
                          <input 
                            type="number" 
                            value={receiveAmount}
                            onChange={(e) => setReceiveAmount(e.target.value)}
                            placeholder={r.amount.toString()}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination Account</label>
                          <select 
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          >
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleReceive(r.id)}
                          className="flex-1 bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <ArrowRightLeft size={12} />
                          <span>Confirm Transfer</span>
                        </button>
                        <button 
                          onClick={() => setReceivingId(null)}
                          className="px-3 bg-slate-100 text-slate-500 text-[10px] font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setReceivingId(r.id);
                        setReceiveAmount(r.amount.toString());
                        if (!selectedAccountId && accounts.length > 0) setSelectedAccountId(accounts[0].id);
                      }}
                      className="w-full bg-indigo-50 text-indigo-600 text-[10px] font-bold py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <ArrowRightLeft size={12} />
                      <span>Receive Payment & Transfer</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
