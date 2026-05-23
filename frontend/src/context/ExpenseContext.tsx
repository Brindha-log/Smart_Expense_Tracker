import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Expense } from '../types';

interface ExpenseContextType {
  income: number;
  setIncome: (amount: number) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  csvFileName: string | null;
  setCsvFileName: (name: string | null) => void;
  clearAll: () => void;
  totalExpenses: number;
  balance: number;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [income, setIncomeState] = useState<number>(() => {
    const saved = localStorage.getItem('monthlyIncome');
    return saved ? parseFloat(saved) : 0;
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  const setIncome = (amount: number) => {
    setIncomeState(amount);
    localStorage.setItem('monthlyIncome', amount.toString());
  };

  const clearAll = () => {
    setExpenses([]);
    setCsvFileName(null);
    // Note: We don't clear income as it's a fixed monthly setting, 
    // but you can add setIncome(0) here if desired.
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  return (
    <ExpenseContext.Provider value={{
      income, setIncome, expenses, setExpenses, 
      csvFileName, setCsvFileName, clearAll, totalExpenses, balance
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};