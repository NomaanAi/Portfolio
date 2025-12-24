"use client";

import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth(true); 

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not admin, useAuth redirects. 
  // We double check user existence to avoid flash.
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
        <AdminSidebar onLogout={logout} />
        <main className="flex-1 ml-64 flex flex-col min-h-screen">
            <AdminHeader user={user} />
            <div className="flex-1 p-8 overflow-y-auto">
                {children}
            </div>
        </main>
    </div>
  );
}
