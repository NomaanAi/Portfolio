import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const NavItem = ({ to, label, icon }) => {
    const active = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:block">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-dark tracking-tighter">Admin<span className="text-primary">.</span></h1>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem to="/admin/dashboard" label="Dashboard" icon="📊" />
          <NavItem to="/admin/projects" label="Projects" icon="💼" />
          <NavItem to="/admin/skills" label="Skills" icon="⚡" />
          <NavItem to="/admin/contacts" label="Contacts" icon="📬" />
          <NavItem to="/admin/social" label="Social Links" icon="🔗" />
          <NavItem to="/admin/homepage" label="Homepage" icon="🏠" />
          <NavItem to="/admin/analytics" label="Analytics" icon="📈" />
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
