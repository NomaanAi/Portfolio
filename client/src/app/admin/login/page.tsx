"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonLabel } from "@/components/common/CommonLabel";
import { CommonCard } from "@/components/common/CommonCard";

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
              <CommonLabel className="text-xs font-bold uppercase tracking-widest text-accent-secondary">ID</CommonLabel>
              <CommonInput 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background font-mono text-sm"
                placeholder="admin@system.local"
                required
              />
            </div>
            
            <div className="space-y-2">
               <CommonLabel className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Key</CommonLabel>
              <CommonInput 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background font-mono text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <CommonButton 
              disabled={loading}
              className="w-full text-sm uppercase tracking-widest"
              size="lg"
            >
              {loading ? "Verifying..." : "Initialize Session"}
            </CommonButton>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
