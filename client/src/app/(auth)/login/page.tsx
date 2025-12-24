"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      
      // Redirect handled by specific logic or default
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="container mx-auto max-w-xl w-full">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">
            Sign In.
          </h1>
          <p className="text-accent-secondary">
             Welcome back. Please enter your credentials.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.1 }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-mono">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-foreground/10 p-4 text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Password</label>
                  <Link href="#" className="text-xs text-accent-secondary hover:text-foreground transition-colors">Forgot?</Link>
               </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-foreground/10 p-4 text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-foreground text-background font-bold py-4 tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Authenticate"}
            </motion.button>
            
            <div className="text-center mt-6">
              <Link href="/register" className="text-sm text-accent-secondary hover:text-foreground transition-colors">
                Don't have an account? <span className="font-bold underline">Sign Up</span>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
