
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin"); // Redirect to dashboard or home? Admin/Dashboard is fine for now as "User Profile"
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <SEO title="Register | Noman.dev" description="Create an account." />
      <div className="w-full max-w-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400">Join Noman.dev</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Create an account to access more features.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent to-purple-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
          >
            Create Account
          </button>
        </form>
         <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
