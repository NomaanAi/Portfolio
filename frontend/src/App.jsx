import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminApp from './admin/AdminApp';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      {/* Public Routes wrapped in Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* Admin Routes (Separate Layout inside AdminApp) */}
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}
