import axios from 'axios';

// Create simple axios instance
// WARN: VITE_API_URL must be set in your environment (e.g. Netlify/Vercel dashboard)
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    const errorMsg = "CRITICAL: VITE_API_URL is not defined! The app cannot connect to the backend.";
    console.error(errorMsg);
    // In production, we might want to throw to stop the app from trying weird URLs
    if (import.meta.env.PROD) throw new Error(errorMsg);
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for cookies if backend sets them
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        // Double check URL before every request
        if (!config.baseURL) {
            console.error("API Call blocked: No valid baseURL configured.");
            // We can cancel the request here or just let it fail naturally
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling (optional but good)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors like 401 Unauthorized here if needed
        if (error.response && error.response.status === 401) {
            // Optional: dispatch logout or clear token
            // localStorage.removeItem('token'); 
            // localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api;
