import api from './api';

export interface TrendData {
    label: string;
    income: number;
    expense: number;
}

export interface Insight {
    text: string;
    type: 'positive' | 'negative' | 'neutral';
}

export interface Warning {
    text: string;
    severity: 'high' | 'medium' | 'low';
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
}

export interface SummaryData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    savingsRate: number | null;
    incomeGrowth: number | null;
    expenseGrowth: number | null;
    balanceGrowth: number | null;
    savingsGrowth: number | null;
}

export interface AnalyticsData {
    hasData: boolean;
    summary: SummaryData;
    trends: {
        daily: TrendData[];
        weekly: TrendData[];
        monthly: TrendData[];
        yearly: TrendData[];
    };
    monthly: {
        totalIncome: number;
        totalExpenses: number;
        balance: number;
        savingsRate: number | null;
        highestSpendingMonth: string | null;
        lowestSpendingMonth: string | null;
    };
    savings: {
        averageSavingsRate: number | null;
        bestSavingsMonth: string | null;
        worstSavingsMonth: string | null;
        deficitMonthsCount: number;
    };
    patterns: {
        highestSpendingDay: string | null;
        highestSpendingCategory: string | null;
        weekendSpendingPercentage: number;
        weekdaySpendingPercentage: number;
    };
    prediction: {
        predictedNextMonthExpense: number;
        predictedEndBalance: number;
    };
    insights: Insight[];
    warnings: Warning[];
    categoryAnalysis: {
        incomeCategories: CategoryBreakdown[];
        expenseCategories: CategoryBreakdown[];
    };
}

export const analyticsService = {
    getAnalytics: async (userId: number, period: string = 'monthly'): Promise<AnalyticsData> => {
        const response = await api.get(`/analytics/${userId}?period=${period}`);
        return response.data;
    }
};
