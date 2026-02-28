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
  note?: string;
}

export interface FutureIncome {
  id: string;
  name: string;
  title: string;
  amount: number;
  dueDate: string;
  receivedDate?: string;
  status: 'pending' | 'received';
  note?: string;
}

export type ViewType = 'balance' | 'daily' | 'cash' | 'receivable' | 'future' | 'history' | 'yearly';
