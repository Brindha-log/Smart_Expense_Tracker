export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Insight {
  id: string;
  text: string;
  type: 'warning' | 'success' | 'info';
}

export interface User {
    id: number;
    name: string;
    email: string;
    monthlyIncome: number;
}

export interface Expense {
    id?: number;
    title: string;
    amount: number;
    category: string;
    date: string;
    type: "income" | "expense";
    userId?: number;
}

export interface FinancialSummary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface DashboardSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    savingsRate: number;
    highestExpense: number;
    monthlyGrowth: number;
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
}

export interface TrendData {
    label: string;
    income: number;
    expense: number;
}

export interface DashboardResponse {
    income: number;
    expenses: number;
    balance: number;
    savingsRate: number | null;
    topCategories: CategoryBreakdown[];
    chartData: TrendData[];
}