import React from 'react';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import type { BudgetWarning as BudgetWarningType } from '../../services/budgetService';

export const BudgetWarning: React.FC<{ warning: BudgetWarningType }> = ({ warning }) => {
    
    let Icon = Info;
    let bgColor = 'bg-blue-50 dark:bg-blue-500/10';
    let borderColor = 'border-blue-200 dark:border-blue-500/20';
    let textColor = 'text-blue-800 dark:text-blue-300';
    let iconColor = 'text-blue-600 dark:text-blue-400';

    if (warning.severity === 'exceeded') {
        Icon = AlertOctagon;
        bgColor = 'bg-rose-50 dark:bg-rose-500/10';
        borderColor = 'border-rose-200 dark:border-rose-500/20';
        textColor = 'text-rose-800 dark:text-rose-300';
        iconColor = 'text-rose-600 dark:text-rose-400';
    } else if (warning.severity === 'critical') {
        Icon = AlertTriangle;
        bgColor = 'bg-orange-50 dark:bg-orange-500/10';
        borderColor = 'border-orange-200 dark:border-orange-500/20';
        textColor = 'text-orange-800 dark:text-orange-300';
        iconColor = 'text-orange-600 dark:text-orange-400';
    } else if (warning.severity === 'warning') {
        Icon = AlertTriangle;
        bgColor = 'bg-amber-50 dark:bg-amber-500/10';
        borderColor = 'border-amber-200 dark:border-amber-500/20';
        textColor = 'text-amber-800 dark:text-amber-300';
        iconColor = 'text-amber-600 dark:text-amber-400';
    }

    return (
        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all hover:scale-[1.01] ${bgColor} ${borderColor}`}>
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <p className={`text-sm font-medium ${textColor}`}>{warning.message}</p>
        </div>
    );
};
