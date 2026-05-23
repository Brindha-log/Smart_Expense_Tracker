import api from './api';

export const authService = {
    sendOtp: async (email: string): Promise<string> => {
        const response = await api.post('/otp/send', { email });
        return response.data || 'OTP sent successfully';
    },

    verifyOtp: async (email: string, code: string): Promise<string> => {
        const response = await api.post('/otp/verify', { email, code });
        return response.data || 'OTP verified';
    },

    resetPassword: async (email: string, newPassword: string, otp: string): Promise<string> => {
        const response = await api.post('/auth/reset-password', { email, newPassword, otp });
        return response.data?.message || 'Password reset successfully';
    }
};
