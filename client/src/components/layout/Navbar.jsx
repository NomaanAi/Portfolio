"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme/ThemeToggle";

const navLinks = [
  { name: "[ PROJECTS ]", href: "/projects" },
  { name: "[ SKILLS ]", href: "/skills" },
  { name: "[ ABOUT ]", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-md bg-background/90 border-b border-white/5 font-mono text-xs uppercase tracking-widest"
    >
      <Link 
        href="/" 
        className="font-bold text-foreground hover:text-white transition-colors"
      >
        NOMAN // DEV
      </Link>

      <div className="hidden md:flex items-center gap-12">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className={`transition-colors duration-300 ${
              pathname === link.href ? "text-white" : "text-gray-500 hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        ))}
        
        <ThemeToggle />
        
        <Link 
          href="/contact"
          className="px-4 py-2 border border-white/20 text-foreground hover:bg-white hover:text-black transition-all duration-300"
        >
          Initialize
        </Link>
      </div>

      {/* Mobile Toggle Placeholder */}
    </motion.nav>
  );
}
