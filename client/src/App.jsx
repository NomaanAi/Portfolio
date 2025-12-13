
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
// User Pages
import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Projects from "./pages/user/Projects";
import Contact from "./pages/user/Contact";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import ProjectDetails from "./pages/user/ProjectDetails";
import Profile from "./pages/user/Profile";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ProjectsAdmin from "./pages/admin/Projects";
import SkillsAdmin from "./pages/admin/Skills";
import Settings from "./pages/admin/Settings";
import SiteSettings from "./pages/admin/SiteSettings";
import ResumeManager from "./pages/admin/ResumeManager";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Login - Separated */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="settings" element={<Settings />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="resume" element={<ResumeManager />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
