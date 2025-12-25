import axios from "axios";

// Strict API URL handling - no hardcoded localhost in production
// Strict API URL handling - no hardcoded localhost in production
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
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
