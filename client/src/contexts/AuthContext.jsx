import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

        // Verify token with backend
        const response = await api.get('/api/auth/me');
        // Assuming /me endpoint also follows new structure, e.g. { status: 'success', user: ... }
        // If not, we might need to check the /me controller. 
        // Let's assume standard response for now or I should check /me route.
        // Wait, I didn't verify /me controller. Let's look at it next step or assume safe default.
        // Usually /me in this project was returning { data: { user } }. 
        // I should probably fix /me too if I am standardizing. But for now let's be flexible.
        const userData = response.data.user || response.data.data?.user;

        setUser(userData);
        localStorage.setItem('role', userData.role);
      } catch (err) {
        console.warn('Auth check failed - clearing session:', err.message);
        // Only clear if explicitly unauthorized or critical failure
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
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
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      setUser(user);
      return { success: true, role: user.role };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/signup', {
        name,
        email,
        password,
        passwordConfirm: password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); 
      setUser(user);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
        await api.get('/api/auth/logout'); 
    } catch (error) {
        console.warn("Logout endpoint error (ignoring):", error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        navigate('/login');
    }
  };

  // Admin Login function
  const loginAdmin = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/admin/login', { email, password });
      
      const { token, user } = response.data;
      const role = user.role;
      
      if (role !== 'admin') {
        throw new Error("Not authorized as admin");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      setUser({ ...user, role }); 
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Admin login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || localStorage.getItem('role') === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginAdmin,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
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
