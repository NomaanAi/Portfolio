import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsAdmin from './pages/ProjectsAdmin';
import SkillsAdmin from './pages/SkillsAdmin';
import ContactsAdmin from './pages/ContactsAdmin';
import SocialAdmin from './pages/SocialAdmin';
import HomepageAdmin from './pages/HomepageAdmin';
import AnalyticsAdmin from './pages/AnalyticsAdmin';
import AdminLayout from './components/AdminLayout';

const isAuth = () => !!localStorage.getItem('admin_token');

const Protected = ({ children }) => {
  if (!isAuth()) return <Navigate to="/admin/login" />;
  return <AdminLayout>{children}</AdminLayout>;
};

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="projects" element={<Protected><ProjectsAdmin /></Protected>} />
      <Route path="skills" element={<Protected><SkillsAdmin /></Protected>} />
      <Route path="contacts" element={<Protected><ContactsAdmin /></Protected>} />
      <Route path="social" element={<Protected><SocialAdmin /></Protected>} />
      <Route path="homepage" element={<Protected><HomepageAdmin /></Protected>} />
      <Route path="analytics" element={<Protected><AnalyticsAdmin /></Protected>} />
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
}
