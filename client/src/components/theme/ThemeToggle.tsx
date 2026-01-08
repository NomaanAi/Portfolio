"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid hydration mismatch
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle Theme"
    >
      <div className="relative z-10">
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-foreground/80 transition-transform rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-foreground/80 transition-transform rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}
