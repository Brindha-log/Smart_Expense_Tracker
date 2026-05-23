import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number | null;
  icon?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon }) => {
 return (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-start w-full transition-colors duration-200">
    <div className="flex items-center space-x-2 mb-4">
      {icon && <span className="text-xl">{icon}</span>}
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {title}
      </h3>
    </div>

    {typeof amount === "number" ? (
      <p className="text-3xl font-bold text-slate-900 dark:text-white">
        ₹{amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    ) : (
      <p className="text-lg font-medium text-slate-400 dark:text-slate-500">No Data</p>
    )}
  </div>
);
};
