import api from './api';
import type { DashboardResponse } from '../types';

export const dashboardService = {
    
    getDashboardData: async (userId: number, period: 'weekly' | 'monthly' | 'yearly' | 'all' = 'monthly', startDate?: string, endDate?: string): Promise<DashboardResponse> => {
        const params: any = {};
        if (startDate && endDate) {
            params.startDate = startDate;
            params.endDate = endDate;
        }
        const response = await api.get(`/dashboard/${userId}/${period}`, { params });
        return response.data;
    }
};
