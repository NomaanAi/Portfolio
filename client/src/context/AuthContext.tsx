"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  loginAdmin: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const { data } = await api.post("/auth/login", credentials);
    // Determine admin or user login based on role if needed, or just standard login
    // If admin login is separate endpoint, we might need a flag.
    // Use standard login for now, if it returns user with role, we are good.
    // Exception: Admin Login page might call a different endpoint if structure is rigid.
    // But typically /login works for all if unified.
    // The previous code had /admin/login calls. 
    // If this is a generic login function, it should handle both or we pass endpoint.
    // Let's stick to standard /auth/login for now, if user is admin, they are admin.
    
    // IF the user is specifically trying to login as admin via admin page, they might call a specific function.
    // But let's keep it simple: API returns user.
    setUser(data.data.user);
  };

  const loginAdmin = async (credentials: any) => {
    const { data } = await api.post("/auth/admin/login", credentials);
    setUser(data.data.user);
  };

  // Dedicated admin login if needed, or just use login.
  // Actually, the previous admin login page called /auth/login (lines 22 in login/page.tsx)
  // Wait, I saw /admin/login in authRoutes (step 15).
  // In Login Page (step 24): `api.post('/auth/login', ...)`
  // So standard login is used.

  const register = async (credentials: any) => {
    const { data } = await api.post("/auth/register", credentials);
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.push("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout failed", error);
      // Force client logout anyway
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAdmin, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
