"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";


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

  return (
    <nav className="fixed top-0 w-full z-50 pt-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-sm transition-all duration-300">
        <div className="container-wide flex h-16 items-center justify-between px-6">
          <Link href="/" className="font-heading font-bold text-xl tracking-tighter hover:opacity-80 transition">
            Noman.Dev
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
              <div className="flex gap-1">
                  {links.map((link) => (
                      <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                              "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                              pathname === link.href 
                                ? "text-foreground" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          )}
                      >
                          {link.label}
                          {pathname === link.href && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                          )}
                      </Link>
                  ))}
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center pl-4 border-l border-border/50">
                  <ThemeToggle />
              </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center gap-2 md:hidden">
               <ThemeToggle />
               <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                   {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden border-t border-border/40 p-4 bg-background/95 rounded-b-2xl">
                <div className="flex flex-col space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                pathname === link.href 
                                  ? "bg-primary/10 text-primary" 
                                  : "hover:bg-secondary"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </div>
    </nav>
  );
}

