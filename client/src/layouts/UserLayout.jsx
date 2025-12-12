import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const location = useLocation();
  const [dark, setDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      navigate('/');
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <nav className="fixed w-full border-b border-slate-200 dark:border-primary/20 bg-white/80 dark:bg-backgroundDark/80 backdrop-blur-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
          Noman<span className="text-slate-900 dark:text-slate-100">.dev</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === "/" ? "text-accent" : "text-slate-500 dark:text-slate-400"}`}>Home</Link>
          <Link to="/about" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-accent transition-colors">About</Link>
          <Link to="/projects" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-accent transition-colors">Projects</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-accent transition-colors">Contact</Link>
          

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-accent transition-all"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-accent transition-colors"
              >
                <User size={16} />
                {user?.name || 'Profile'}
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-accent transition-colors">
                <span className="flex items-center gap-1">
                  <LogIn size={16} /> Login
                </span>
              </Link>
              <Link to="/register" className="text-sm font-medium bg-accent text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900 dark:text-slate-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-backgroundDark border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-900 dark:text-slate-100 hover:text-accent">Home</Link>

              <button
                onClick={() => setDark(!dark)}
                className="flex items-center gap-2 text-slate-900 dark:text-slate-100 hover:text-accent"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />} <span>Theme</span>
              </button>
              
               {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 dark:text-slate-100 hover:text-accent">
                    <User size={16} />
                    {user?.name || 'Profile'}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 text-slate-900 dark:text-slate-100 hover:text-accent">
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link to="/register" className="text-accent font-medium">Join Noman.dev</Link>
                </>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-backgroundDark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Navbar />
      <main className="pt-20 px-4 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        © {new Date().getFullYear()} Noman. All rights reserved.
      </footer>
    </div>
  );
}
