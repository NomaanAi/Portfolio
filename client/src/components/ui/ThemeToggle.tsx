"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";


export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-accent/10 transition-colors relative"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
            className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
        />
        <Moon 
            className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
        />
      </div>
    </button>
  );
}
