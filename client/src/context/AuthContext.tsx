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
  loginGoogle: (token: string) => Promise<void>;
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

  const checkAuth = async (retryCount = 0) => {
    try {
      const { data } = await api.get("/auth/me");
      // /auth/me returns { status: 'success', user: ... } directly
      setUser(data.user);
    } catch (error: any) {
      // Only logout on definitive auth failures
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
      } else {
        // Handle Cold Starts / Network Errors (Render Free Tier)
        if (retryCount < 3) {
           console.log(`Backend warm-up / retry attempt ${retryCount + 1}...`);
           await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
           return checkAuth(retryCount + 1);
        }
        // If all retries fail, keep user null but don't redirect (let UI handle offline state if needed)
        console.error("Auth check failed after retries:", error);
        setUser(null);
      }
    } finally {
      // Only stop loading after success or max retries
      if (retryCount >= 3 || user) {
          setLoading(false);
      } else {
         // If we are succeeding, we still need to turn off loading
          setLoading(false);
      }
    }
  };

  // Improved useEffect to handle cleanup
  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
        try {
            await checkAuth();
        } finally {
            if (mounted) setLoading(false);
        }
    };

    initAuth();
    
    return () => { mounted = false; };
  }, []);

  const login = async (credentials: any) => {
    const { data } = await api.post("/auth/login", credentials);
    setUser(data.data.user);
  };

  const loginGoogle = async (token: string) => {
    const { data } = await api.post("/auth/google", { token });
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
    <AuthContext.Provider value={{ user, loading, login, loginGoogle, loginAdmin, register, logout, checkAuth }}>
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
