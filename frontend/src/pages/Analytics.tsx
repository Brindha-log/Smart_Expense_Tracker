import React, { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { AnalyticsData } from '../services/analyticsService';
import { AnalyticsEmptyState } from '../components/analytics/AnalyticsEmptyState';
import { InsightCard, WarningCard } from '../components/analytics/InsightCards';
import { PredictionCard } from '../components/analytics/PredictionCard';
import { useApp } from '../context/AppContext';
import { SpendingTrendChart, CategoryPieChart, PredictionChart } from '../charts/AnalyticsCharts';
import { BrainCircuit, TrendingUp, Calendar, Target, Activity, ChartColumnIncreasing } from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Safely compute growth %. Returns null instead of blowing up when
 * previous value is 0 or missing.
 */
function safeGrowth(current: number, previous: number): number | null {
    if (previous === 0 || previous === null || previous === undefined) return null;
    return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}

export const Analytics: React.FC = () => {
    const { user } = useApp();
    const userId = user?.id || 1;
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const [period, setPeriod] = useState<Period>('monthly');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const result = await analyticsService.getAnalytics(userId, period);
            setData(result);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, period]);

    useEffect(() => {
        fetchAnalytics();
        const handleDataUpdate = () => fetchAnalytics();
        window.addEventListener('data-updated', handleDataUpdate);
        return () => window.removeEventListener('data-updated', handleDataUpdate);
    }, [fetchAnalytics]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data || !data.hasData) {
        return <AnalyticsEmptyState />;
    }


    const currentTrendData = data.trends[period] || [];

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500 pb-10">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ChartColumnIncreasing className="text-blue-600 dark:text-blue-400" />
                        Intelligence Analytics
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Statistical forecasting and AI-driven insights.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setPeriod(t)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                                period === t
                                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="px-3 py-2 text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 ml-1"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* Summary Cards Removed as requested */}

            {/* Insights & Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.warnings.map((w, idx) => <WarningCard key={idx} warning={w} />)}
                {data.insights.map((i, idx) => <InsightCard key={idx} insight={i} />)}
            </div>

            {/* Predictions */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-500" />
                    Predictive Forecasting
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PredictionCard
                        title="Predicted Next Month Expense"
                        value={`₹${data.prediction.predictedNextMonthExpense.toLocaleString()}`}
                        subtitle="Based on 3-month moving average"
                        isPositive={false}
                    />
                    <PredictionCard
                        title="Est. End of Month Balance"
                        value={`₹${data.prediction.predictedEndBalance.toLocaleString()}`}
                        subtitle="Based on current daily burn rate"
                        isPositive={data.prediction.predictedEndBalance > 0}
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-500" />
                            Spending Velocity ({period})
                        </h3>
                    </div>
                    <SpendingTrendChart data={currentTrendData} dataKey="expense" isDarkMode={isDarkMode} />
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        Trajectory Projection
                    </h3>
                    <div className="flex-1">
                        <PredictionChart data={data.trends.monthly} predictedNextMonth={data.prediction.predictedNextMonthExpense} isDarkMode={isDarkMode} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <Target className="w-4 h-4 text-slate-500" />
                        Top Expense Drivers
                    </h3>
                    <CategoryPieChart data={data.categoryAnalysis.expenseCategories.slice(0, 5)} isDarkMode={isDarkMode} />
                </div>

                <div className="xl:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Behavioral Patterns
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Highest Day</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">{data.patterns.highestSpendingDay?.toLowerCase() || 'N/A'}</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Top Category</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">{data.patterns.highestSpendingCategory || 'N/A'}</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Weekend Spends</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{data.patterns.weekendSpendingPercentage}%</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Weekday Spends</div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{data.patterns.weekdaySpendingPercentage}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

