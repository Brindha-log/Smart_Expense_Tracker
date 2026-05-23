import React, { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardResponse } from '../types';
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { ExpensePieChart } from '../charts/ExpensePieChart';
import { ExpenseBarChart } from '../charts/ExpenseBarChart';
import { Card } from '../components/common/Card';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
    const { user } = useApp();
    const userId = user?.id || 1;
    const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly' | 'all'>('all');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await dashboardService.getDashboardData(userId, period);
            
            // IMPORTANT: Use user's manually set monthly income, not from CSV
            if (user?.monthlyIncome && user.monthlyIncome > 0) {
                data.income = user.monthlyIncome;
                data.balance = user.monthlyIncome - data.expenses;
                if (user.monthlyIncome > 0) {
                    data.savingsRate = Math.round(((data.balance / user.monthlyIncome) * 100) * 10) / 10;
                }
            }
            
            setDashboardData(data);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, period, user?.monthlyIncome]);

    useEffect(() => {
        fetchData();

        // Re-fetch whenever HomePage uploads or removes CSV data
        const handleDataUpdate = () => fetchData();
        window.addEventListener('data-updated', handleDataUpdate);
        return () => window.removeEventListener('data-updated', handleDataUpdate);
    }, [fetchData]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    if (isLoading && !dashboardData) {
        return <div className="flex justify-center py-20 text-slate-500">Loading analytics...</div>;
    }

    const isTotallyEmpty = dashboardData && dashboardData.expenses === 0 && dashboardData.income === 0;

    if (isTotallyEmpty && period === 'all') {
        return <DashboardEmptyState />;
    }

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Overview of your income and expenses.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    >
                        <option value="weekly">Weekly (Group by Week)</option>
                        <option value="monthly">Monthly (Group by Month)</option>
                        <option value="yearly">Yearly (Group by Year)</option>
                        <option value="all">All Time</option>
                    </select>
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsCard 
                    title="Total Balance" 
                    value={`₹${(dashboardData?.balance || 0).toFixed(2)}`}
                    icon={<span className="text-lg leading-none">💰</span>}
                    valueColor={(dashboardData?.balance || 0) > 0 ? 'text-green-600 dark:text-green-400' : (dashboardData?.balance || 0) < 0 ? 'text-red-600 dark:text-red-400' : ''}
                    warning={(dashboardData?.balance || 0) < 0 ? "You are spending more than your income" : undefined}
                />
                <AnalyticsCard 
                    title="Total Income" 
                    value={`₹${(dashboardData?.income || 0).toFixed(2)}`}
                    icon={<span className="text-lg leading-none">📈</span>}
                />
                <AnalyticsCard 
                    title="Total Expenses" 
                    value={`₹${(dashboardData?.expenses || 0).toFixed(2)}`}
                    icon={<span className="text-lg leading-none">📉</span>}
                />
                <AnalyticsCard 
                    title="Savings Rate" 
                    value={dashboardData?.savingsRate !== null && dashboardData?.savingsRate !== undefined ? `${dashboardData.savingsRate}%` : 'No Data'}
                    icon={<span className="text-lg leading-none">🎯</span>}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Trend Chart */}
                <Card className="lg:col-span-2 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Income vs Expense</h3>
                    <div className="flex-1">
                        <ExpenseBarChart data={dashboardData?.chartData || []} isDarkMode={isDarkMode} />
                    </div>
                </Card>

                {/* Pie Chart & Top Categories */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Spending by Category</h3>
                        <ExpensePieChart data={dashboardData?.topCategories || []} isDarkMode={isDarkMode} />
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top 5 Expenses</h3>
                        <div className="space-y-4">
                            {(dashboardData?.topCategories || []).slice(0, 5).map((cat, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{cat.category}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">₹{cat.amount.toFixed(0)} ({cat.percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                        <div 
                                            className="bg-slate-900 dark:bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
