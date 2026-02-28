import React from 'react';
import { Account, Receivable, FutureIncome, Transaction } from '../types';
import { Wallet, ArrowDownRight, TrendingUp, Calendar, Landmark, TrendingDown } from 'lucide-react';

interface BalanceSheetProps {
  accounts: Account[];
  receivables: Receivable[];
  futureIncomes: FutureIncome[];
  transactions: Transaction[];
}

export const BalanceSheet: React.FC<BalanceSheetProps> = ({ accounts, receivables, futureIncomes, transactions }) => {
  const cash = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const cashReceivable = receivables
    .filter(r => r.status !== 'received')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalBalance = cash + cashReceivable;
  
  const futureIncome = futureIncomes
    .filter(fi => fi.status !== 'received')
    .reduce((sum, fi) => sum + fi.amount, 0);
  
  const futureBalance = totalBalance + futureIncome;

  // Calculate current month's income and expense
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Balance Sheet</p>
        <h1 className="text-4xl font-bold text-slate-900">${totalBalance.toLocaleString()}</h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Net Worth (Cash + Receivables)</p>
      </header>

      {/* Monthly Summary Section */}
      <section className="px-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar size={16} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">This Month's Summary</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp size={14} className="text-emerald-600" />
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Income</p>
              </div>
              <p className="text-xl font-bold text-emerald-700">${monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingDown size={14} className="text-rose-600" />
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Expense</p>
              </div>
              <p className="text-xl font-bold text-rose-700">${monthlyExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="px-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-50 p-2.5 rounded-2xl text-indigo-600">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cash</p>
                <p className="text-lg font-bold text-slate-900">${cash.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600">
                <ArrowDownRight size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cash Receivable</p>
                <p className="text-lg font-bold text-slate-900">${cashReceivable.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center space-x-3 mb-1">
              <TrendingUp size={18} className="text-indigo-200" />
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Total Balance</p>
            </div>
            <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
            <p className="text-[9px] opacity-60 mt-1 italic">Combined liquid and expected assets</p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Future Income</p>
                <p className="text-lg font-bold text-slate-900">${futureIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center space-x-3 mb-1">
              <Landmark size={18} className="text-slate-400" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Future Balance</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">${futureBalance.toLocaleString()}</p>
            <p className="text-[9px] opacity-60 mt-1 italic">Projected net worth including all future income</p>
          </div>
        </div>
      </section>
    </div>
  );
};
