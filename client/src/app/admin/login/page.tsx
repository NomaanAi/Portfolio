"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginAdmin({ email, password });
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <div className="w-full max-w-md">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="bg-surface border border-border/50 p-8 rounded-2xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading mb-2 text-foreground">
              Command Access
            </h1>
            <p className="text-xs font-mono text-accent-secondary uppercase tracking-widest">
               Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-secondary">ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border/20 p-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors rounded-md font-mono text-sm"
                placeholder="admin@system.local"
                required
              />
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border/20 p-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors rounded-md font-mono text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-md text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Initialize Session"}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
