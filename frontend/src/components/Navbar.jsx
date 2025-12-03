import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary';

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-dark tracking-tighter">
            Portfolio<span className="text-primary">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors`}>Home</Link>
            <Link to="/projects" className={`${isActive('/projects')} transition-colors`}>Projects</Link>
            <Link to="/contact" className={`${isActive('/contact')} transition-colors`}>Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-600 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" onClick={() => setIsOpen(false)} className={`block py-2 ${isActive('/')}`}>Home</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className={`block py-2 ${isActive('/projects')}`}>Projects</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={`block py-2 ${isActive('/contact')}`}>Contact</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
