import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Account, Receivable } from '../types';

interface BalanceSheetProps {
  accounts: Account[];
  receivables: Receivable[];
}

export const BalanceSheet: React.FC<BalanceSheetProps> = ({ accounts, receivables }) => {
  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalReceivables = receivables
    .filter(r => r.status !== 'received')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const netWorth = totalAssets + totalReceivables;

  const data = [
    { name: 'Cash/Bank', value: totalAssets, color: '#4f46e5' },
    { name: 'Receivables', value: totalReceivables, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Balance Sheet</p>
        <h1 className="text-4xl font-bold text-slate-900">${netWorth.toLocaleString()}</h1>
      </header>

      <section className="px-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Asset Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">{item.name}</span>
                  <span className="text-sm font-bold">${item.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4">
        <h2 className="text-sm font-semibold text-slate-900 mb-3 px-1">Accounts Summary</h2>
        <div className="space-y-3">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-900">{acc.name}</p>
                <p className="text-xs text-slate-400 capitalize">{acc.type}</p>
              </div>
              <p className="text-base font-bold text-slate-900">${acc.balance.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
