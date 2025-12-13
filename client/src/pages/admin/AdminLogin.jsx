
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in as admin, go to dashboard
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/api/auth/admin/login`, {
        email,
        password,
      });

      // Strict Admin Check
      if (res.data.role !== "admin") {
        setError("Access denied: Not an administrator.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("role", res.data.role);

      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-slate-950 text-slate-100">
      <SEO title="Admin Portal | Noman.dev" description="Admin access only." />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-4">
             <span className="text-xl font-bold text-black">A</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Restricted Area. Authorized personnel only.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 outline-none"
              placeholder="noman.dev@admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-900/50 text-red-500 text-xs text-center border-l-4 border-l-red-500">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors shadow-lg shadow-cyan-900/20"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-400">Return to Site</a>
        </div>
      </motion.div>
    </div>
  );
}
