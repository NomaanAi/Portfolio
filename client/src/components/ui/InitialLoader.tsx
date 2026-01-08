"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if we've already shown the loader this session
    const hasLoaded = sessionStorage.getItem("portfolio_loaded");
    
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // Minimum load time for effect
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("portfolio_loaded", "true");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);



  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.5 }}
               className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center relative"
            >
                <div className="absolute inset-0 border border-accent-primary/20 rounded-full animate-ping opacity-20" />
                <Bot className="w-10 h-10 text-accent-primary" />
            </motion.div>

            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-center"
            >
                <h2 className="text-xl font-bold mb-2">Initializing Portfolio</h2>
                <div className="flex items-center justify-center gap-1 text-accent-primary font-mono text-sm">
                    <span>Establishing Connection</span>
                    <span className="w-1 h-1 bg-accent-primary rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-accent-primary rounded-full animate-bounce delay-100" />
                    <span className="w-1 h-1 bg-accent-primary rounded-full animate-bounce delay-200" />
                </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
