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

        const response = await api.get('/api/auth/me');

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
      const response = await api.post('/api/auth/login', { email, password });
      const { token } = response.data;
      const { user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); // Persist role
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
      const response = await api.post('/api/auth/signup', {
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
  const logout = async () => {
    try {
        await api.get('/api/auth/logout'); // Clear server cookie
    } catch (error) {
        console.error("Logout error", error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    }
  };

  // Admin Login function
  const loginAdmin = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/admin/login', { email, password });
      
      const { token, role } = response.data;
      const { user } = response.data.data;
      
      // Double check role
      if (role !== 'admin') {
        throw new Error("Not authorized as admin");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      setUser({ ...user, role }); // Ensure user object has role
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || err.message || 'Admin login failed';
      setError(error);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginAdmin, // Export new function
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || localStorage.getItem('role') === 'admin', // Fallback to localStorage for immediate check
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
