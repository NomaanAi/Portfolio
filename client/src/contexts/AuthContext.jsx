import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.data.user);
        localStorage.setItem('role', response.data.data.user.role); // Sync role
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      const { token } = response.data;
      const { user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); // Persist role
      // Sync user to localStorage for persistence across refreshes if needed, 
      // but Context usually relies on checkAuth. 
      // However, Login.jsx was setting "user" in localStorage. 
      // We should probably allow checkAuth to hydrate it, or set it here too if we rely on it.
      // But let's stick to standard Context pattern: update state.
      setUser(user);
      return { success: true, role: user.role };
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      setError(error);
      return { success: false, error };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      // Use full URL or proxy. Assuming proxy is set or we should use VITE_API_BASE_URL
      // Best to align with pages.
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await axios.post(`${API_BASE}/api/auth/signup`, {
        name,
        email,
        password,
        passwordConfirm: password
      });
      
      const { token } = response.data;
      const { user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); // Persist role
      setUser(user);
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Registration failed';
      setError(error);
      return { success: false, error };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
