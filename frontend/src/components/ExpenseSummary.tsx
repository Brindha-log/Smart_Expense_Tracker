import React from 'react';

interface ExpenseSummaryProps {
  total: number;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ total }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center w-full">
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Expenses This Month</h3>
      <p className="text-4xl font-extrabold text-slate-900">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
};
