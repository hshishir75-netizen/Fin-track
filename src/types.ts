export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'savings' | 'investment';
}

export interface Receivable {
  id: string;
  from: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue';
}

export interface FutureIncome {
  id: string;
  source: string;
  amount: number;
  expectedDate: string;
  probability: number; // 0 to 1
}

export type ViewType = 'balance' | 'cash' | 'receivable' | 'future' | 'history';
