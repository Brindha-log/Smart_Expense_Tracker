import React from 'react';

interface Props {
    usedLimit: number;
    creditLimit: number;
}

export default function CreditUsageBar({ usedLimit, creditLimit }: Props) {
    const utilization = creditLimit > 0 ? (usedLimit / creditLimit) * 100 : 0;
    
    // Color Rules: Green < 30%, Yellow 30–70%, Red > 70%
    let colorClass = 'bg-emerald-500';
    if (utilization >= 70) {
        colorClass = 'bg-rose-500';
    } else if (utilization >= 30) {
        colorClass = 'bg-amber-500';
    }

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Utilization</span>
                <span className={`font-bold ${
                    utilization >= 70 ? 'text-rose-500' : utilization >= 30 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                    {utilization.toFixed(1)}%
                </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                ></div>
            </div>
            {utilization >= 80 && (
                <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    High utilization warning! Approaching credit limit.
                </p>
            )}
        </div>
    );
}
