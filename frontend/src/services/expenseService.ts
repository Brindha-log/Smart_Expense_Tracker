import api from './api';
import type { Expense, FinancialSummary, PageResponse } from '../types';

export const expenseService = {
    
    getAllExpenses: async (userId: number): Promise<Expense[]> => {
        const response = await api.get(`/expenses/user/${userId}`);
        return response.data;
    },

    getExpensesPage: async (userId: number, page: number, size: number): Promise<PageResponse<Expense>> => {
        const response = await api.get(`/expenses/user/${userId}/page?page=${page}&size=${size}`);
        return response.data;
    },

    addExpense: async (userId: number, expense: Expense): Promise<Expense> => {
        const response = await api.post(`/expenses/user/${userId}`, expense);
        return response.data;
    },

    updateExpense: async (id: number, expense: Expense): Promise<Expense> => {
        const response = await api.put(`/expenses/${id}`, expense);
        return response.data;
    },

    deleteExpense: async (id: number): Promise<void> => {
        await api.delete(`/expenses/${id}`);
    },

    clearUserExpenses: async (userId: number): Promise<void> => {
        await api.delete(`/expenses/user/${userId}/clear-csv`);
    },

    getSummary: async (userId: number): Promise<FinancialSummary> => {
        const response = await api.get(`/expenses/user/${userId}/summary`);
        return response.data;
    },

    uploadCsv: async (userId: number, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(`/expenses/user/${userId}/upload-csv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    
    setMonthlyIncome: async (userId: number, monthlyIncome: number): Promise<any> => {
        const response = await api.put(`/users/${userId}/income`, { monthlyIncome });
        return response.data;
    }
};
