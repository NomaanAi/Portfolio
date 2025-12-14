import api from './api';

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });

        // Explicitly check success status
        if (response.data.status === 'success') {
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            // Store user role to help with initial UI state before "me" call returns
            localStorage.setItem('role', user.role);

            return { token, user };
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const registerUser = async (name, email, password) => {
    try {
        // using /register as that is what user instructions implied, and authRoutes has it.
        const response = await api.post('/api/auth/register', { name, email, password });

        if (response.data.status === 'success') {
            return true;
        } else {
            throw new Error(response.data.message || 'Registration failed');
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const loginAdmin = async (email, password) => {
    try {
        const response = await api.post('/api/auth/admin/login', { email, password });

        if (response.data.status === 'success') {
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            return { token, user };
        }
        throw new Error(response.data.message || 'Admin login failed');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/api/auth/me');
        if (response.data.status === 'success') {
            return response.data.user;
        }
    } catch (error) {
        // If 401, we just return null, handled by caller or interceptor
        throw error;
    }
};
