import axios from "axios";

// Strict API URL handling
const getBaseUrl = () => {
  // In production, we must have the env var. In dev, we can fallback to localhost.
  let url = process.env.NEXT_PUBLIC_API_URL;
  
  if (!url) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
       url = "http://localhost:5000/api";
    } else {
       // Is production/deployed but missing env var - critical error
       if (process.env.NODE_ENV !== 'development') {
          console.error("CRITICAL: NEXT_PUBLIC_API_URL is missing in production environment variables!");
       }
       // Fallback to relative path if proxying is expected, or empty to let it fail visibly
       url = "/api"; 
    }
  }

  if (url && url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  if (url && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  
  if (url && !url.endsWith('/')) {
    url = `${url}/`;
  }
  
  return url;
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL : `${API_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Bulletproof URL joining: remove leading slash from request URL 
// to ensure it appends to baseURL (/api/) instead of joining from root
api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('/')) {
        config.url = config.url.substring(1);
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Auth Failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token but avoid infinite redirects
      if (typeof window !== "undefined") {
        // Only redirect if not already on login
        if (!window.location.pathname.includes("/login")) {
           // localStorage.removeItem("token"); // Optional: decide if we auto-logout
           // window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
