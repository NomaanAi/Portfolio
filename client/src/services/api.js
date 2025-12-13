import axios from 'axios';

// Create simple axios instance
// WARN: VITE_API_URL must be set in your environment (e.g. Netlify/Vercel dashboard)
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    console.error("CRITICAL: VITE_API_URL is not defined in this environment. API calls will fail.");
}

const api = axios.create({
    baseURL: baseURL, // Do not fallback to localhost in production code!
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
