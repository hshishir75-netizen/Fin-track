import React from 'react';
import { BarChart3, Target, Zap } from 'lucide-react';
import { FutureIncome } from '../types';

interface FutureIncomeViewProps {
  futureIncomes: FutureIncome[];
}

export const FutureIncomeView: React.FC<FutureIncomeViewProps> = ({ futureIncomes }) => {
  const totalProjected = futureIncomes.reduce((sum, fi) => sum + (fi.amount * fi.probability), 0);

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Future Income-able</p>
        <h1 className="text-4xl font-bold text-slate-900">${totalProjected.toLocaleString()}</h1>
        <p className="text-xs text-slate-400 mt-1">Weighted by probability</p>
      </header>

      <section className="px-4">
        <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target size={20} className="text-indigo-300" />
            <h2 className="text-sm font-semibold">Income Forecast</h2>
          </div>
          <div className="space-y-4">
            {futureIncomes.map((fi) => (
              <div key={fi.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{fi.source}</span>
                  <span className="font-mono">${fi.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-indigo-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-400 rounded-full" 
                    style={{ width: `${fi.probability * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] opacity-60">
                  <span>Exp. {fi.expectedDate}</span>
                  <span>{Math.round(fi.probability * 100)}% Confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Zap size={18} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-900">Opportunities</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Based on your current trajectory, you have 3 high-probability income events in the next 30 days.
          </p>
        </div>
      </section>
    </div>
  );
};
