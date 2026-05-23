import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Insight, Warning } from '../../services/analyticsService';

export const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const getIcon = () => {
        if (insight.type === 'positive') return <TrendingDown className="w-5 h-5 text-emerald-500" />;
        if (insight.type === 'negative') return <TrendingUp className="w-5 h-5 text-rose-500" />;
        return <Minus className="w-5 h-5 text-blue-500" />;
    };

    const getBgColor = () => {
        if (insight.type === 'positive') return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
        if (insight.type === 'negative') return 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20';
        return 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
    };

    return (
        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all hover:scale-[1.02] ${getBgColor()}`}>
            <div className="mt-0.5">{getIcon()}</div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{insight.text}</p>
        </div>
    );
};

export const WarningCard: React.FC<{ warning: Warning }> = ({ warning }) => {
    return (
        <div className="p-4 rounded-xl border bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 flex items-start gap-3 transition-all hover:scale-[1.02]">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{warning.text}</p>
        </div>
    );
};
