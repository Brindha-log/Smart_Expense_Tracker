import api from './api';

export interface UserProfile {
    id: number;
    fullName?: string;
    name?: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    currency: string;
    joinedDate: string;
    monthlyIncome?: number;
    role?: string;
}

export const profileService = {
    getMyProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/profile/me');
        return response.data;
    },

    updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await api.put('/profile/update', profileData);
        return response.data;
    },

    uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/profile/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    sendOtp: async (email: string): Promise<string> => {
        const response = await api.post('/otp/send', { email });
        return response.data;
    },

    verifyOtp: async (email: string, code: string): Promise<string> => {
        const response = await api.post('/otp/verify', { email, code });
        return response.data;
    },

    changePassword: async (passwordData: any): Promise<string> => {
        const response = await api.post('/auth/change-password', passwordData);
        return response.data;
    },

    updateEmail: async (emailData: any): Promise<{ token: string }> => {
        const response = await api.post('/profile/update-email', emailData);
        return response.data;
    }
};
