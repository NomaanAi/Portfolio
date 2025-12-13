
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, FolderKanban, Settings, LogOut, Code2, Globe, FileText, User } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  
  const links = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Globe, label: "Site Config", path: "/admin/site-settings" },
    { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
    { icon: Code2, label: "Skills", path: "/admin/skills" },
    { icon: FileText, label: "Resume", path: "/admin/resume" },
    { icon: User, label: "Profile", path: "/admin/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 border-r border-white/5 bg-slate-950 h-screen fixed left-0 top-0 flex flex-col text-sm"
    >
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2 text-slate-100">
           <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
           <span className="font-bold tracking-wider text-xs uppercase text-slate-400">Admin Control</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                isActive 
                  ? "bg-white/5 text-cyan-400 border-l-2 border-cyan-400" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-slate-600 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button> 
      </div>
    </motion.aside>
  );
}

export default function AdminLayout() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || role !== "admin") {
    // Force redirect if not admin
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Sidebar />
      <main className="pl-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
