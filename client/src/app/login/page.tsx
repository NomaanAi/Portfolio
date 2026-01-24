"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import api from "@/lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("auth/admin-login", { email, password });
      
      if (res.data.status === "success") {
        localStorage.setItem("admin_token", res.data.token);
        // Simple cookie for middleware if needed
        document.cookie = `admin_token=${res.data.token}; path=/; max-age=86400; SameSite=Strict`;
        router.push("/admin");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6 text-primary">
            <div className="p-4 bg-background rounded-full border border-border">
                <Lock className="w-8 h-8" />
            </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-foreground mb-2">Admin Access</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-widest font-mono">Archive Entry Verification</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-all text-sm"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg font-mono">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center shadow-lg shadow-primary/20"
            >
              {loading ? "Verifying..." : "Access System"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
