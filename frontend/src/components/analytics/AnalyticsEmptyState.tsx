import React from 'react';
import { FileBarChart2 } from 'lucide-react';

export const AnalyticsEmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FileBarChart2 className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No analytics data available</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Upload a CSV file of your transactions to generate powerful insights, view spending patterns, and predict future expenses.
            </p>
        </div>
    );
};
