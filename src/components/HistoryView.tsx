import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Transaction } from '../types';

interface HistoryViewProps {
  transactions: Transaction[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Download size={20} />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button className="bg-white border border-slate-200 p-2 rounded-xl text-slate-600">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <section className="px-4">
        <div className="space-y-4">
          {/* Grouping by date would be better, but let's keep it simple for now */}
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-bold">
                  {tx.category.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{tx.date} • {tx.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
