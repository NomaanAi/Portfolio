"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonLabel } from "@/components/common/CommonLabel";

const MotionButton = motion(CommonButton);

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type === "text" && e.target.placeholder === "John Doe" ? "name" : e.target.type === "email" ? "email" : "password"]: e.target.value });
    // simpler to just use name attribute
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Create Identity.
          </h1>
          <p className="text-accent-secondary">
             Join the network.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.1 }}
        >
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-mono">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <CommonLabel className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Full Name</CommonLabel>
              <CommonInput 
                type="text"
                name="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-surface p-4 border-foreground/10 focus:border-foreground/30"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <CommonLabel className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Email</CommonLabel>
              <CommonInput 
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-surface p-4 border-foreground/10 focus:border-foreground/30"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <CommonLabel className="text-xs font-bold uppercase tracking-widest text-accent-secondary">Password</CommonLabel>
              <CommonInput 
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-surface p-4 border-foreground/10 focus:border-foreground/30"
                placeholder="••••••••"
                required
              />
            </div>

            <MotionButton 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-foreground text-background font-bold py-4 tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 h-auto rounded-none"
            >
              {loading ? "Registering..." : "Register"}
            </MotionButton>
            
            <div className="text-center mt-6">
              <Link href="/login" className="text-sm text-accent-secondary hover:text-foreground transition-colors">
                Already have an account? <span className="font-bold underline">Sign In</span>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
