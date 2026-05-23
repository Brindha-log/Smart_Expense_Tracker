import api from './api';

export interface BudgetSummary {
    id: number;
    category: string;
    limitAmount: number;
    spentAmount: number;
    remainingAmount: number;
    utilizationPercentage: number;
    exceeded: boolean;
}

export interface BudgetAnalytics {
    totalBudgeted: number;
    totalSpent: number;
    overallUtilization: number;
    mostExceededCategory: string | null;
    safestCategory: string | null;
}

export interface BudgetWarning {
    message: string;
    severity: 'warning' | 'critical' | 'exceeded';
}

export interface BudgetData {
    hasBudgets: boolean;
    globalBudget: BudgetSummary | null;
    categoryBudgets: BudgetSummary[];
    analytics: BudgetAnalytics;
    warnings: BudgetWarning[];
}

export const budgetService = {
    getBudgets: async (userId: number, month: string): Promise<BudgetData> => {
        const response = await api.get(`/budgets/${userId}?month=${month}`);
        return response.data;
    },
    
    saveBudget: async (userId: number, category: string, limitAmount: number, month: string) => {
        const response = await api.post(`/budgets/${userId}`, { category, limitAmount, month });
        return response.data;
    },
    
    deleteBudget: async (budgetId: number) => {
        await api.delete(`/budgets/${budgetId}`);
    }
};
