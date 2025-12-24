"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Menu, X, User as UserIcon, LogOut, Github, Linkedin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 w-full border-b border-border/20 bg-background/60 backdrop-blur-md z-50 transition-colors duration-300">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl tracking-tighter hover:opacity-80 transition">
          Noman.Dev
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                            pathname === link.href 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Social Links (Always Visible) */}
            <div className="flex items-center gap-4 border-l border-border/50 pl-6 pr-6">
                 <a href="https://github.com/NomaanAi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="w-5 h-5" />
                 </a>
                 <a href="https://www.linkedin.com/in/nomaanai/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="w-5 h-5" />
                 </a>
            </div>

            {/* Auth Buttons & Theme Toggle */}
            <div className="flex items-center gap-4 border-l border-border/50 pl-6">
                {!user ? (
                    <>
                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="px-4 py-2 bg-foreground text-background text-sm font-bold rounded-full hover:opacity-90 transition-opacity">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="relative">
                        <button 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </button>
                        
                        {/* Simple User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl overflow-hidden py-1">
                                <div className="px-4 py-3 border-b border-border/50">
                                    <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        logout();
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-secondary/50 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                        {/* Click outside listener */}
                         {showUserMenu && (
                            <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
                         )}
                    </div>
                )}
                
                <ThemeToggle />
            </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
             <ThemeToggle />
             <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                 {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
              <div className="flex flex-col p-4 space-y-2">
                  {links.map((link) => (
                      <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                              "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                              pathname === link.href 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-secondary/50"
                          )}
                      >
                          {link.label}
                      </Link>
                  ))}
                  
                  <div className="h-px bg-border/50 my-2" />
                  
                  {!user ? (
                      <div className="flex flex-col gap-2">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
                        >
                            Login
                        </Link>
                         <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-bold bg-foreground text-background text-center transition-opacity hover:opacity-90"
                        >
                            Register
                        </Link>
                      </div>
                  ) : (
                      <button
                          onClick={() => {
                              logout();
                              setIsOpen(false);
                          }}
                          className="px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 text-left flex items-center gap-2 transition-colors"
                      >
                          <LogOut className="w-4 h-4" />
                          Logout ({user?.name})
                      </button>
                  )}
              </div>
          </div>
      )}
    </nav>
  );
}
