import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { BalanceSheet } from './components/BalanceSheet';
import { CashView } from './components/CashView';
import { DailyTransactionView } from './components/DailyTransactionView';
import { ReceivablesView } from './components/ReceivablesView';
import { FutureIncomeView } from './components/FutureIncomeView';
import { HistoryView } from './components/HistoryView';
import { YearlyStatementView } from './components/YearlyStatementView';
import { ViewType, Account, Transaction, Receivable, FutureIncome } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Cash', balance: 0, type: 'cash' },
  { id: '2', name: 'Reserve Cash', balance: 0, type: 'cash' },
  { id: '3', name: 'Bkash', balance: 0, type: 'bank' },
  { id: '4', name: 'Nagad', balance: 0, type: 'bank' },
  { id: '5', name: 'Rocket', balance: 0, type: 'bank' },
  { id: '6', name: 'Agrani Bank', balance: 0, type: 'bank' },
  { id: '7', name: 'IBBL', balance: 0, type: 'bank' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_RECEIVABLES: Receivable[] = [];

const INITIAL_FUTURE_INCOME: FutureIncome[] = [];

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('balance');
  
  // Initialize state from localStorage or mock data
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('finance_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [receivables, setReceivables] = useState<Receivable[]>(() => {
    const saved = localStorage.getItem('finance_receivables');
    return saved ? JSON.parse(saved) : INITIAL_RECEIVABLES;
  });
  
  const [futureIncomes, setFutureIncomes] = useState<FutureIncome[]>(() => {
    const saved = localStorage.getItem('finance_future_incomes');
    return saved ? JSON.parse(saved) : INITIAL_FUTURE_INCOME;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const saveData = () => {
    setIsSaving(true);
    localStorage.setItem('finance_accounts', JSON.stringify(accounts));
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    localStorage.setItem('finance_receivables', JSON.stringify(receivables));
    localStorage.setItem('finance_future_incomes', JSON.stringify(futureIncomes));
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    }, 600);
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear everything.')) {
      localStorage.removeItem('finance_accounts');
      localStorage.removeItem('finance_transactions');
      localStorage.removeItem('finance_receivables');
      localStorage.removeItem('finance_future_incomes');
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setReceivables(INITIAL_RECEIVABLES);
      setFutureIncomes(INITIAL_FUTURE_INCOME);
    }
  };

  const addAccount = (newAccount: Omit<Account, 'id'>) => {
    const account: Account = {
      ...newAccount,
      id: Math.random().toString(36).substr(2, 9)
    };
    setAccounts([...accounts, account]);
  };

  const addReceivable = (newReceivable: Omit<Receivable, 'id'>) => {
    const receivable: Receivable = {
      ...newReceivable,
      id: Math.random().toString(36).substr(2, 9)
    };
    setReceivables([receivable, ...receivables]);
  };

  const addFutureIncome = (newIncome: Omit<FutureIncome, 'id'>) => {
    const income: FutureIncome = {
      ...newIncome,
      id: Math.random().toString(36).substr(2, 9)
    };
    setFutureIncomes([income, ...futureIncomes]);
  };

  const receiveReceivable = (receivableId: string, accountId: string, amountReceived: number) => {
    const receivable = receivables.find(r => r.id === receivableId);
    if (!receivable || receivable.status === 'received') return;

    const isFullPayment = amountReceived >= receivable.amount;

    // Update receivable: remove if full payment, otherwise update amount
    if (isFullPayment) {
      setReceivables(prev => prev.filter(r => r.id !== receivableId));
    } else {
      setReceivables(prev => prev.map(r => {
        if (r.id === receivableId) {
          return { ...r, amount: r.amount - amountReceived };
        }
        return r;
      }));
    }

    // Add to account balance
    handleTransaction(accountId, amountReceived, 'income', `Received from ${receivable.from}: ${receivable.note || ''}`);
  };

  const receiveFutureIncome = (incomeId: string, accountId: string, amountReceived: number) => {
    const income = futureIncomes.find(i => i.id === incomeId);
    if (!income || income.status === 'received') return;

    const isFullPayment = amountReceived >= income.amount;

    // Update future income: remove if full payment, otherwise update amount
    if (isFullPayment) {
      setFutureIncomes(prev => prev.filter(i => i.id !== incomeId));
    } else {
      setFutureIncomes(prev => prev.map(i => {
        if (i.id === incomeId) {
          return { ...i, amount: i.amount - amountReceived };
        }
        return i;
      }));
    }

    // Add to account balance
    handleTransaction(accountId, amountReceived, 'income', `Received Future Income (${income.title}): ${income.note || ''}`);
  };

  const handleTransaction = (accountId: string, amount: number, type: 'income' | 'expense', note: string, customDate?: string) => {
    // Update account balance
    setAccounts(prevAccounts => prevAccounts.map(acc => {
      if (acc.id === accountId) {
        const newBalance = type === 'income' ? acc.balance + amount : acc.balance - amount;
        return { ...acc, balance: newBalance };
      }
      return acc;
    }));

    // Add to transactions history
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: customDate || new Date().toISOString().split('T')[0],
      amount,
      category: type === 'income' ? 'Direct Income' : 'Direct Expense',
      description: note || (type === 'income' ? 'Credit' : 'Debit'),
      type,
      accountId
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'balance':
        return <BalanceSheet accounts={accounts} receivables={receivables} futureIncomes={futureIncomes} transactions={transactions} />;
      case 'daily':
        return <DailyTransactionView 
          accounts={accounts} 
          transactions={transactions} 
          onTransaction={handleTransaction} 
        />;
      case 'cash':
        return <CashView 
          accounts={accounts} 
          recentTransactions={transactions} 
          onAddAccount={addAccount} 
          onTransaction={handleTransaction}
        />;
      case 'receivable':
        return <ReceivablesView 
          receivables={receivables} 
          accounts={accounts}
          onAddReceivable={addReceivable} 
          onReceive={receiveReceivable}
        />;
      case 'future':
        return <FutureIncomeView 
          futureIncomes={futureIncomes} 
          accounts={accounts}
          onAddFutureIncome={addFutureIncome}
          onReceive={receiveFutureIncome}
        />;
      case 'history':
        return <HistoryView transactions={transactions} accounts={accounts} />;
      case 'yearly':
        return <YearlyStatementView transactions={transactions} />;
      default:
        return <BalanceSheet accounts={accounts} receivables={receivables} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] max-w-md mx-auto relative shadow-2xl shadow-black/5">
      {/* Global Save & Reset Buttons */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <button 
          onClick={resetData}
          className="bg-white/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 p-2 rounded-full shadow-lg transition-all active:scale-95 border border-slate-100"
          title="Reset All Data"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button 
          onClick={saveData}
          disabled={isSaving}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all active:scale-95",
            showSaveSuccess 
              ? "bg-emerald-500 text-white" 
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : showSaveSuccess ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          )}
          <span className="text-xs font-bold uppercase tracking-widest">
            {isSaving ? 'Saving...' : showSaveSuccess ? 'Saved!' : 'Save'}
          </span>
        </button>
      </div>

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
