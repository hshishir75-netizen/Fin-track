import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Receivable } from '../types';

interface ReceivablesViewProps {
  receivables: Receivable[];
}

export const ReceivablesView: React.FC<ReceivablesViewProps> = ({ receivables }) => {
  const totalPending = receivables
    .filter(r => r.status !== 'received')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Cash Receivable</p>
        <h1 className="text-4xl font-bold text-slate-900">${totalPending.toLocaleString()}</h1>
      </header>

      <section className="px-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overdue</p>
            <p className="text-lg font-bold text-rose-600">
              ${receivables.filter(r => r.status === 'overdue').reduce((s, r) => s + r.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming</p>
            <p className="text-lg font-bold text-indigo-600">
              ${receivables.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-slate-900 mb-3">All Receivables</h2>
        <div className="space-y-3">
          {receivables.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border border-slate-100">
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
                  <p className="text-sm font-medium text-slate-900">{r.from}</p>
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
          ))}
        </div>
      </section>
    </div>
  );
};
