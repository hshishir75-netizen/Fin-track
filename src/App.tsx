import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { BalanceSheet } from './components/BalanceSheet';
import { CashView } from './components/CashView';
import { ReceivablesView } from './components/ReceivablesView';
import { FutureIncomeView } from './components/FutureIncomeView';
import { HistoryView } from './components/HistoryView';
import { ViewType, Account, Transaction, Receivable, FutureIncome } from './types';

// Mock Data
const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Main Savings', balance: 12450.50, type: 'savings' },
  { id: '2', name: 'Checking Account', balance: 3200.00, type: 'bank' },
  { id: '3', name: 'Cash Wallet', balance: 450.00, type: 'cash' },
  { id: '4', name: 'Investment Portfolio', balance: 45000.00, type: 'investment' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-20', amount: 3500, category: 'Salary', description: 'Monthly Salary', type: 'income', accountId: '2' },
  { id: 't2', date: '2024-05-21', amount: 120, category: 'Groceries', description: 'Whole Foods', type: 'expense', accountId: '2' },
  { id: 't3', date: '2024-05-22', amount: 45, category: 'Dining', description: 'Starbucks Coffee', type: 'expense', accountId: '3' },
  { id: 't4', date: '2024-05-23', amount: 800, category: 'Rent', description: 'Apartment Rent', type: 'expense', accountId: '2' },
  { id: 't5', date: '2024-05-24', amount: 200, category: 'Freelance', description: 'Logo Design Project', type: 'income', accountId: '2' },
];

const INITIAL_RECEIVABLES: Receivable[] = [
  { id: 'r1', from: 'John Doe', amount: 500, dueDate: '2024-06-01', status: 'pending' },
  { id: 'r2', from: 'Tech Corp', amount: 2500, dueDate: '2024-05-15', status: 'overdue' },
  { id: 'r3', from: 'Sarah Smith', amount: 150, dueDate: '2024-05-28', status: 'pending' },
];

const INITIAL_FUTURE_INCOME: FutureIncome[] = [
  { id: 'f1', source: 'Quarterly Bonus', amount: 5000, expectedDate: '2024-07-15', probability: 0.8 },
  { id: 'f2', source: 'Tax Refund', amount: 1200, expectedDate: '2024-06-10', probability: 0.95 },
  { id: 'f3', source: 'Stock Dividends', amount: 300, expectedDate: '2024-06-20', probability: 0.7 },
];

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('balance');
  const [accounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [receivables] = useState<Receivable[]>(INITIAL_RECEIVABLES);
  const [futureIncomes] = useState<FutureIncome[]>(INITIAL_FUTURE_INCOME);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'balance':
        return <BalanceSheet accounts={accounts} receivables={receivables} />;
      case 'cash':
        return <CashView accounts={accounts} recentTransactions={transactions} />;
      case 'receivable':
        return <ReceivablesView receivables={receivables} />;
      case 'future':
        return <FutureIncomeView futureIncomes={futureIncomes} />;
      case 'history':
        return <HistoryView transactions={transactions} />;
      default:
        return <BalanceSheet accounts={accounts} receivables={receivables} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] max-w-md mx-auto relative shadow-2xl shadow-black/5">
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
