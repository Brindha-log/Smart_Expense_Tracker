import React from 'react';

interface TransactionCardProps {
  title: string;
  category: string;
  amount: number;
  date: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ title, category, amount, date }) => {
  const isExpense = amount < 0;
  
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center w-full mb-3 transition-colors duration-200">
      <div className="flex flex-col">
        <p className="text-base font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{category} • {date}</p>
      </div>
      <div className="flex items-center">
        <p className={`text-lg font-bold ${isExpense ? 'text-slate-700 dark:text-slate-300' : 'text-blue-700 dark:text-blue-400'}`}>
          {isExpense ? '-' : '+'}₹{Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};
