import React from 'react';
import { Calendar, TrendingUp, TrendingDown, Landmark, ArrowRight } from 'lucide-react';
import { Transaction, Account } from '../types';

interface HistoryViewProps {
  transactions: Transaction[];
  accounts: Account[];
}

interface MonthlySummary {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  endBalance: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ transactions, accounts }) => {
  // 1. Group transactions by month and calculate income/expense
  const summaries: Record<string, MonthlySummary> = {};
  
  // Sort transactions by date descending
  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  
  // Current total balance
  let currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  // We need to find the balance at the end of each month.
  // We'll iterate through all transactions from newest to oldest.
  // The balance at the end of a month is the balance AFTER all transactions of that month have occurred.
  
  // First, identify all unique months in the transactions and include the current month
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const monthsSet = new Set(transactions.map(t => t.date.substring(0, 7)));
  monthsSet.add(currentMonthStr);
  const months = Array.from(monthsSet).sort().reverse() as string[];
  
  // To calculate end balances correctly, we need to know the balance at each month's end.
  // We start from the current balance and work backwards.
  const monthEndBalances: Record<string, number> = {};
  
  // Group transactions and calculate totals
  months.forEach(m => {
    summaries[m] = { month: m, income: 0, expense: 0, endBalance: 0 };
  });

  transactions.forEach(tx => {
    const month = tx.date.substring(0, 7);
    if (summaries[month]) {
      if (tx.type === 'income') {
        summaries[month].income += tx.amount;
      } else {
        summaries[month].expense += tx.amount;
      }
    }
  });

  // Calculate end balances by working backwards from current balance
  // We need to reverse transactions that happened AFTER the month we are looking at.
  months.forEach((m, index) => {
    // The end balance for month 'm' is the current balance minus all transactions that happened AFTER month 'm'
    let balanceAtEndOfM = currentBalance;
    sortedTransactions.forEach(tx => {
      if (tx.date.substring(0, 7) > m) {
        // Reverse this transaction
        if (tx.type === 'income') {
          balanceAtEndOfM -= tx.amount;
        } else {
          balanceAtEndOfM += tx.amount;
        }
      }
    });
    monthEndBalances[m] = balanceAtEndOfM;
    if (summaries[m]) {
      summaries[m].endBalance = balanceAtEndOfM;
    }
  });

  const sortedSummaries = Object.values(summaries).sort((a, b) => b.month.localeCompare(a.month));

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Financial History</p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Monthly Performance</h1>
      </header>

      <section className="px-4">
        <div className="space-y-4">
          {sortedSummaries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">No transaction history available yet.</p>
            </div>
          ) : (
            sortedSummaries.map((s, idx) => {
              const prevMonthSummary = sortedSummaries[idx + 1];
              const balanceChange = prevMonthSummary ? s.endBalance - prevMonthSummary.endBalance : 0;
              const isIncreasing = balanceChange >= 0;

              return (
                <div key={s.month} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-900 p-2 rounded-xl text-white">
                        <Calendar size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{formatMonth(s.month)}</h3>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      isIncreasing ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {isIncreasing ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{isIncreasing ? 'Growing' : 'Decreasing'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp size={14} className="text-emerald-600" />
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total Income</p>
                      </div>
                      <p className="text-xl font-bold text-emerald-700">${s.income.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingDown size={14} className="text-rose-600" />
                        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Total Expense</p>
                      </div>
                      <p className="text-xl font-bold text-rose-700">${s.expense.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-xl text-slate-900 shadow-sm border border-slate-100">
                        <Landmark size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month-End Balance</p>
                        <p className="text-lg font-bold text-slate-900">${s.endBalance.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold uppercase ${balanceChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {balanceChange >= 0 ? '+' : ''}{balanceChange.toLocaleString()}
                      </p>
                      <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter">vs Prev Month</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
