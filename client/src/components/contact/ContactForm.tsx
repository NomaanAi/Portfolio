"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import api from "@/lib/axios";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Portfolio Inquiry",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post('/contact', formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "Portfolio Inquiry", message: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {status === "success" && (
           <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-mono text-center">
             Message transmitted successfully. I will be in touch shortly.
           </div>
        )}
        {status === "error" && (
           <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-mono text-center">
             {errorMessage}
           </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
            Name
          </label>
          <input 
            type="text" 
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-surface border border-foreground/10 p-4 text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
            Email
          </label>
          <input 
            type="email" 
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-surface border border-foreground/10 p-4 text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            placeholder="nomanshaikh0998@gmail.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
            Message
          </label>
          <textarea 
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-surface border border-foreground/10 p-4 text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"
            placeholder="Tell me about your project..."
            required
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-cursor="hover"
          disabled={status === "loading" || status === "success"}
          className="w-full bg-foreground text-background font-bold py-5 tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Transmitting..." : status === "success" ? "Sent" : "Send Message"}
        </motion.button>
      </form>
    </div>
  );
}
