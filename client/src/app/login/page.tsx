"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-xl">
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
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Email</label>
              <input 
                type="email" 
                className="w-full bg-surface border border-white/10 p-4 text-foreground focus:outline-none focus:border-white/30 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Password</label>
                  <Link href="#" className="text-xs text-accent-secondary hover:text-foreground transition-colors">Forgot?</Link>
               </div>
              <input 
                type="password" 
                className="w-full bg-surface border border-white/10 p-4 text-foreground focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-foreground text-background font-bold py-4 tracking-widest uppercase hover:bg-white transition-colors"
            >
              Authenticate
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
