import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus } from 'lucide-react';
import { budgetService } from '../services/budgetService';
import type { BudgetData } from '../services/budgetService';
import { BudgetCard } from '../components/budget/BudgetCard';
import { BudgetEmptyState } from '../components/budget/BudgetEmptyState';
import { BudgetWarning } from '../components/budget/BudgetWarning';
import { BudgetForm } from '../components/budget/BudgetForm';
import { useApp } from '../context/AppContext';

export const Budgets: React.FC = () => {
    const { theme } = useApp();
    const isDark = theme === 'dark';
    
    const { user } = useApp();
    const userId = user?.id || 1;
    const [data, setData] = useState<BudgetData | null>(null);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [monthOffset, setMonthOffset] = useState(0);

    const getMonthString = (offset: number) => {
        const d = new Date();
        d.setMonth(d.getMonth() + offset);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    const fetchBudgets = useCallback(async () => {
        try {
            setLoading(true);
            const monthStr = getMonthString(monthOffset);
            const result = await budgetService.getBudgets(userId, monthStr);
            setData(result);
        } catch (error) {
            console.error("Failed to fetch budgets", error);
        } finally {
            setLoading(false);
        }
    }, [userId, monthOffset]);

    useEffect(() => {
        fetchBudgets();
        
        // Listen for dataset changes (CSV upload/delete)
        const handleDataUpdate = () => fetchBudgets();
        window.addEventListener('data-updated', handleDataUpdate);
        return () => window.removeEventListener('data-updated', handleDataUpdate);
    }, [fetchBudgets]);

    const handleSaveBudget = async (category: string, amount: number) => {
        const monthStr = getMonthString(monthOffset);
        await budgetService.saveBudget(userId, category, amount, monthStr);
        fetchBudgets(); // refresh
    };

    const handleDeleteBudget = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this budget limit?")) return;
        await budgetService.deleteBudget(id);
        fetchBudgets();
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentMonthLabel = new Date(new Date().setMonth(new Date().getMonth() + monthOffset)).toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className={`p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in ${isDark ? 'dark' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        Budget Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and manage your monthly spending limits</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <button onClick={() => setMonthOffset(prev => prev - 1)} className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">&lt;</button>
                        <span className="px-4 font-medium text-sm text-slate-700 dark:text-slate-200">{currentMonthLabel}</span>
                        <button onClick={() => setMonthOffset(prev => prev + 1)} className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">&gt;</button>
                    </div>
                    
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Set Budget
                    </button>
                </div>
            </div>

            {!data || !data.hasBudgets ? (
                <BudgetEmptyState />
            ) : (
                <div className="space-y-8">
                    {/* Warnings Section */}
                    {data.warnings && data.warnings.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.warnings.map((w, idx) => (
                                <BudgetWarning key={idx} warning={w} />
                            ))}
                        </div>
                    )}

                    {/* Overall Monthly Budget (if exists) */}
                    {data.globalBudget && (
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Overall Monthly Budget</h2>
                            <BudgetCard budget={data.globalBudget} onDelete={handleDeleteBudget} />
                        </div>
                    )}

                    {/* Category Budgets */}
                    {data.categoryBudgets && data.categoryBudgets.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
                                Category Budgets
                                <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    {data.categoryBudgets.length} Categories
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.categoryBudgets.map(b => (
                                    <BudgetCard key={b.id} budget={b} onDelete={handleDeleteBudget} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <BudgetForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSubmit={handleSaveBudget} 
                />
            )}
        </div>
    );
};