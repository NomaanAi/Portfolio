import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token and enforce VITE_API_URL
api.interceptors.request.use(
    (config) => {
        // 1. Enforce VITE_API_URL presence
        if (!import.meta.env.VITE_API_URL) {
            throw new Error("CRITICAL: VITE_API_URL is missing. The app cannot make requests.");
        }

        // 2. Add Authorization token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
