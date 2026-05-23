import React from 'react';
import { Button } from '../common/Button';

export const DashboardEmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 dark:bg-slate-800">
                <span className="text-4xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 dark:text-white">No Analytics Data Available</h2>
            <p className="text-slate-500 max-w-md mb-8 dark:text-slate-400">
                Upload your transactions CSV file to instantly generate beautiful charts, spending insights, and financial summaries.
            </p>
            <Button onClick={() => window.location.href = '/'}>
                Go to Home to Upload
            </Button>
        </div>
    );
};
