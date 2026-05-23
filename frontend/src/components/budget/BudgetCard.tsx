import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import type { BudgetSummary } from '../../services/budgetService';
import { useApp } from '../../context/AppContext';

interface BudgetCardProps {
    budget: BudgetSummary;
    onDelete: (id: number) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onDelete }) => {
    const { theme } = useApp();
    const isDark = theme === 'dark';

    // Progress bar color logic
    let progressColor = 'bg-emerald-500';
    if (budget.utilizationPercentage >= 100) progressColor = 'bg-rose-500';
    else if (budget.utilizationPercentage >= 90) progressColor = 'bg-orange-500';
    else if (budget.utilizationPercentage >= 70) progressColor = 'bg-amber-400';

    const safePercentage = Math.min(budget.utilizationPercentage, 100);

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Deficit Background Glow */}
            {budget.exceeded && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            )}
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                        {budget.category === 'TOTAL_MONTHLY' ? 'Global Monthly Limit' : budget.category}
                        {budget.exceeded && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        ₹{budget.spentAmount.toLocaleString()} of ₹{budget.limitAmount.toLocaleString()}
                    </p>
                </div>
                {budget.category !== 'TOTAL_MONTHLY' && (
                    <button 
                        onClick={() => onDelete(budget.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        title="Delete Budget"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden relative z-10">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                    style={{ width: `${safePercentage}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center text-sm relative z-10">
                <span className={`font-semibold ${budget.exceeded ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {budget.exceeded 
                        ? `Overspent by ₹${Math.abs(budget.remainingAmount).toLocaleString()}` 
                        : `₹${budget.remainingAmount.toLocaleString()} left`}
                </span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                    {budget.utilizationPercentage}%
                </span>
            </div>
        </div>
    );
};
