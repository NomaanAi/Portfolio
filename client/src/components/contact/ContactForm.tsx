"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
            Name
          </label>
          <input 
            type="text" 
            id="name"
            className="w-full bg-surface border border-white/10 p-4 text-foreground focus:outline-none focus:border-white/30 transition-colors"
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
            Email
          </label>
          <input 
            type="email" 
            id="email"
            className="w-full bg-surface border border-white/10 p-4 text-foreground focus:outline-none focus:border-white/30 transition-colors"
            placeholder="john@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
            Message
          </label>
          <textarea 
            id="message"
            rows={6}
            className="w-full bg-surface border border-white/10 p-4 text-foreground focus:outline-none focus:border-white/30 transition-colors resize-none"
            placeholder="Tell me about your project..."
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-cursor="hover"
          className="w-full bg-foreground text-background font-bold py-5 tracking-widest uppercase hover:bg-white transition-colors"
        >
          Send Message
        </motion.button>
      </form>
    </div>
  );
}
