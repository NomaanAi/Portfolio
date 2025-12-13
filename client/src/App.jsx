
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
// Guards
import { RequireAuth, RequireAdmin } from "./routes/guards";

// User Pages
import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Projects from "./pages/user/Projects";
import Contact from "./pages/user/Contact";
// import Login from "./pages/user/Login"; // OLD
import Login from "./pages/Login"; // NEW
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
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        {/* Keeping other routes accessible if needed, or strictly following prompt? 
            User said 'Fix ALL...'. I will add the others as open routes or guarded if logical, 
            but strictly the prompt only mandates the above. 
            I will add back the other existing routes (About, Projects etc) to avoid breaking the whole app 
            but ensure Home and Admin are strictly guarded. */}
         <Route path="/about" element={<About />} />
         <Route path="/projects" element={<Projects />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/register" element={<Register />} />
      </Routes>
    </AnimatePresence>
  );
}
