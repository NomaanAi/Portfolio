"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Code, FolderKanban, FileText, Settings, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Skills", href: "/admin/skills", icon: Code },
  { name: "AI Assistant", href: "/admin/chat", icon: MessageCircle },
  { name: "Settings & Content", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border/40 z-50 flex flex-col transition-transform duration-300">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <h1 className="font-heading font-bold text-xl tracking-tighter">Admin Panel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
