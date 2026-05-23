import React from 'react';

interface AnalyticsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    valueColor?: string;
    warning?: string;
    className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon, trend, valueColor, warning, className = '' }) => {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 dark:bg-slate-800 dark:border-slate-700 ${className}`}>
            <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {icon}
                </div>
            </div>
            <div className="mt-4">
                <h2 className={`text-2xl font-bold ${valueColor || 'text-slate-900 dark:text-white'}`}>{value}</h2>
                
                {warning && (
                    <div className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                        {warning}
                    </div>
                )}

                {trend && !warning && (
                    <div className="flex items-center mt-2 gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{trend.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
