import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smart-expense-tracker-youq.onrender.com/api',
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle 401 Unauthorized globally
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('registeredUser');
        localStorage.removeItem('auth_user');

        // Only redirect if not already on login/landing
        const currentView = localStorage.getItem('currentAppView');
        if (currentView !== 'login' && currentView !== 'landing' && currentView !== 'register') {
            localStorage.setItem('currentAppView', 'login');
            window.location.reload();
        }
    }
    return Promise.reject(error);
});

export default api;
