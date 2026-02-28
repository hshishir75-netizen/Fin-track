import React from 'react';
import { Transaction } from '../types';
import { Calendar, ChevronRight, ChevronDown } from 'lucide-react';

interface YearlyStatementViewProps {
  transactions: Transaction[];
}

interface MonthlyData {
  month: number;
  monthName: string;
  income: number;
  expense: number;
}

interface YearlyData {
  year: number;
  months: MonthlyData[];
  totalIncome: number;
  totalExpense: number;
}

export const YearlyStatementView: React.FC<YearlyStatementViewProps> = ({ transactions }) => {
  // Group transactions by year and month
  const yearlyDataMap: Record<number, YearlyData> = {};

  transactions.forEach(tx => {
    const date = new Date(tx.date);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    if (!yearlyDataMap[year]) {
      yearlyDataMap[year] = {
        year,
        months: Array.from({ length: 12 }, (_, i) => ({
          month: i,
          monthName: new Date(0, i).toLocaleString('default', { month: 'long' }),
          income: 0,
          expense: 0
        })),
        totalIncome: 0,
        totalExpense: 0
      };
    }

    const yearData = yearlyDataMap[year];
    const monthData = yearData.months[month];

    if (tx.type === 'income') {
      monthData.income += tx.amount;
      yearData.totalIncome += tx.amount;
    } else {
      monthData.expense += tx.amount;
      yearData.totalExpense += tx.amount;
    }
  });

  const sortedYears = Object.values(yearlyDataMap).sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Yearly Statement</p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Performance by Year</h1>
      </header>

      <section className="px-4 space-y-8">
        {sortedYears.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">No transaction history available yet.</p>
          </div>
        ) : (
          sortedYears.map(yearData => (
            <div key={yearData.year} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-indigo-400" />
                  <h2 className="text-lg font-bold">{yearData.year} Statement</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Yearly Net</p>
                  <p className={`text-sm font-bold ${yearData.totalIncome - yearData.totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${(yearData.totalIncome - yearData.totalExpense).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Income</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Expense</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.months.map((monthData, idx) => {
                      const net = monthData.income - monthData.expense;
                      // Only show months that have data or are in the past/current month of the current year
                      const isCurrentYear = yearData.year === new Date().getFullYear();
                      const isPastOrCurrentMonth = monthData.month <= new Date().getMonth();
                      
                      if (!isCurrentYear || isPastOrCurrentMonth || monthData.income > 0 || monthData.expense > 0) {
                        return (
                          <tr key={monthData.month} className={`border-b border-slate-50 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            <td className="py-3 px-4 text-sm font-medium text-slate-700">{monthData.monthName}</td>
                            <td className="py-3 px-4 text-sm font-bold text-emerald-600 text-right">
                              {monthData.income > 0 ? `$${monthData.income.toLocaleString()}` : '-'}
                            </td>
                            <td className="py-3 px-4 text-sm font-bold text-rose-600 text-right">
                              {monthData.expense > 0 ? `$${monthData.expense.toLocaleString()}` : '-'}
                            </td>
                            <td className={`py-3 px-4 text-sm font-bold text-right ${net >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                              {net !== 0 ? `$${net.toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/50 font-bold">
                      <td className="py-3 px-4 text-sm text-slate-900 uppercase tracking-widest">Total</td>
                      <td className="py-3 px-4 text-sm text-emerald-700 text-right">${yearData.totalIncome.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-rose-700 text-right">${yearData.totalExpense.toLocaleString()}</td>
                      <td className={`py-3 px-4 text-sm text-right ${yearData.totalIncome - yearData.totalExpense >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
                        ${(yearData.totalIncome - yearData.totalExpense).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
