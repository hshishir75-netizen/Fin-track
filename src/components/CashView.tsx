import React from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Account, Transaction } from '../types';

interface CashViewProps {
  accounts: Account[];
  recentTransactions: Transaction[];
}

export const CashView: React.FC<CashViewProps> = ({ accounts, recentTransactions }) => {
  const totalCash = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Available Cash</p>
          <h1 className="text-4xl font-bold text-slate-900">${totalCash.toLocaleString()}</h1>
        </div>
        <button className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
          <Plus size={24} />
        </button>
      </header>

      <section className="px-4 overflow-x-auto hide-scrollbar flex space-x-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="min-w-[200px] bg-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wallet size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{acc.type}</span>
            </div>
            <p className="text-xs opacity-80 mb-1">{acc.name}</p>
            <p className="text-xl font-bold">${acc.balance.toLocaleString()}</p>
          </div>
        ))}
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
