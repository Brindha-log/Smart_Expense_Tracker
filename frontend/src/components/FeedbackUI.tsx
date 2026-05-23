import React from 'react';

// --- 10. LOADING SKELETON LAYER ---
export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full p-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-4 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3" />
      <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-2/3" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2" />
    </div>
  );
};

// --- 1. GENERAL EMPTY STATE ENGINE INTERFACE ---
interface EmptyStateProps {
  title: string;
  message: string;
  actionElement?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actionElement }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 max-w-md mx-auto my-4 transition-colors">
      {/* Dynamic Placeholder Asset Node Circle */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4 px-2 leading-relaxed">{message}</p>
      {actionElement && <div className="mt-1">{actionElement}</div>}
    </div>
  );
};