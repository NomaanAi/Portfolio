"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const dummyUser = { name: "Admin", email: "admin@portfolio.dev" };

  useEffect(() => {
    // Simple client-side gate
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
      localStorage.removeItem("admin_token");
      document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/login");
  };

  if (!authorized) {
      return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 ml-64 flex flex-col min-h-screen">
            <AdminHeader user={dummyUser} />
            <div className="flex-1 p-8 overflow-y-auto">
                {children}
            </div>
        </main>
    </div>
  );
}
