
import { useState, useEffect } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { User, Lock, Save } from "lucide-react";
import SEO from "../../components/SEO";



export default function Settings() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.put(
        "/api/auth/profile",
        { name, email, password }
      );
      
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPassword(""); // Clear password field
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <SEO title="Settings | Admin" description="Manage your account settings." />

      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="bg-card border border-border rounded-xl p-8 max-w-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="text-accent" size={24} /> Profile Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="text-accent" size={24} /> Security
            </h2>
            
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-accent/20"
          >
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}
