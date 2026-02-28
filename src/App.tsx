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

// Mock Data
const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Cash', balance: 5000, type: 'cash' },
  { id: '2', name: 'Reserve Cash', balance: 15000, type: 'cash' },
  { id: '3', name: 'Bkash', balance: 2500, type: 'bank' },
  { id: '4', name: 'Nagad', balance: 1800, type: 'bank' },
  { id: '5', name: 'Rocket', balance: 1200, type: 'bank' },
  { id: '6', name: 'Agrani Bank', balance: 45000, type: 'bank' },
  { id: '7', name: 'IBBL', balance: 32000, type: 'bank' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2026-02-20', amount: 3500, category: 'Salary', description: 'Monthly Salary', type: 'income', accountId: '2' },
  { id: 't2', date: '2026-02-21', amount: 120, category: 'Groceries', description: 'Whole Foods', type: 'expense', accountId: '2' },
  { id: 't3', date: '2026-01-22', amount: 45, category: 'Dining', description: 'Starbucks Coffee', type: 'expense', accountId: '3' },
  { id: 't4', date: '2026-01-23', amount: 800, category: 'Rent', description: 'Apartment Rent', type: 'expense', accountId: '2' },
  { id: 't5', date: '2026-01-24', amount: 200, category: 'Freelance', description: 'Logo Design Project', type: 'income', accountId: '2' },
  { id: 't6', date: '2025-12-15', amount: 3500, category: 'Salary', description: 'Monthly Salary', type: 'income', accountId: '2' },
  { id: 't7', date: '2025-12-10', amount: 1500, category: 'Expense', description: 'Laptop Purchase', type: 'expense', accountId: '6' },
  { id: 't8', date: '2025-11-05', amount: 3500, category: 'Salary', description: 'Monthly Salary', type: 'income', accountId: '2' },
  { id: 't9', date: '2025-11-12', amount: 500, category: 'Expense', description: 'Car Service', type: 'expense', accountId: '2' },
];

const INITIAL_RECEIVABLES: Receivable[] = [
  { id: 'r1', from: 'John Doe', amount: 500, dueDate: '2024-06-01', status: 'pending' },
  { id: 'r2', from: 'Tech Corp', amount: 2500, dueDate: '2024-05-15', status: 'overdue' },
  { id: 'r3', from: 'Sarah Smith', amount: 150, dueDate: '2024-05-28', status: 'pending' },
];

const INITIAL_FUTURE_INCOME: FutureIncome[] = [
  { id: 'f1', name: 'Company X', title: 'Quarterly Bonus', amount: 5000, dueDate: '2024-07-15', status: 'pending' },
  { id: 'f2', name: 'IRS', title: 'Tax Refund', amount: 1200, dueDate: '2024-06-10', status: 'pending' },
  { id: 'f3', name: 'E-Trade', title: 'Stock Dividends', amount: 300, dueDate: '2024-06-20', status: 'pending' },
];

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('balance');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [receivables, setReceivables] = useState<Receivable[]>(INITIAL_RECEIVABLES);
  const [futureIncomes, setFutureIncomes] = useState<FutureIncome[]>(INITIAL_FUTURE_INCOME);

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

    // Update receivable
    setReceivables(prev => prev.map(r => {
      if (r.id === receivableId) {
        if (isFullPayment) {
          return { ...r, status: 'received', amount: 0 };
        } else {
          return { ...r, amount: r.amount - amountReceived };
        }
      }
      return r;
    }));

    // Add to account balance
    handleTransaction(accountId, amountReceived, 'income', `Received from ${receivable.from}: ${receivable.note || ''}`);
  };

  const receiveFutureIncome = (incomeId: string, accountId: string, amountReceived: number) => {
    const income = futureIncomes.find(i => i.id === incomeId);
    if (!income || income.status === 'received') return;

    const isFullPayment = amountReceived >= income.amount;

    // Update future income
    setFutureIncomes(prev => prev.map(i => {
      if (i.id === incomeId) {
        if (isFullPayment) {
          return { 
            ...i, 
            status: 'received', 
            amount: 0, 
            receivedDate: new Date().toISOString().split('T')[0] 
          };
        } else {
          return { ...i, amount: i.amount - amountReceived };
        }
      }
      return i;
    }));

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
