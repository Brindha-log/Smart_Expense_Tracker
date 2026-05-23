import React from 'react';
import { Target } from 'lucide-react';

export const BudgetEmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your first budget</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Set monthly limits and categorize your spending to prevent overspending and reach your financial goals faster.
            </p>
        </div>
    );
};
