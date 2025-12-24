"use client";

import  ThemeToggle  from "@/components/theme/ThemeToggle"; // Verify path exists

export function AdminHeader({ user }: { user: any }) {
  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blursupports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="text-sm text-muted-foreground">
        Welcome back, <span className="font-semibold text-foreground">{user?.name || "Admin"}</span>
      </div>
      <div className="flex items-center gap-4">
        {/* We reuse the global theme toggle */}
         <ThemeToggle />
      </div>
    </header>
  );
}
