import React from 'react';

// 1. Define the interface with the exact props you are passing
interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

// 2. Apply the interface to the component
export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 transition-colors duration-200">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{message}</h3>
      <p className="text-gray-500 dark:text-slate-400">{subMessage}</p>
    </div>
  );
};