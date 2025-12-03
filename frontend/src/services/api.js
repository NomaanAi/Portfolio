import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const getAnalytics = () => api.get('/analytics/stats');
export const getAnalyticsEvents = () => api.get('/analytics');
export const trackEvent = (event, meta) => api.post('/analytics/track', { event, meta });

export const login = (data) => api.post('/auth/login', data);



export const getContacts = () => api.get('/contacts');
export const markContactRead = (id) => api.patch(`/contacts/${id}/read`);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

export const getSocial = () => api.get('/social');
export const updateSocial = (data) => api.put('/social', data);

export const getHomepage = () => api.get('/homepage');
export const updateHomepage = (data) => api.put('/homepage', data);

export default api;
