"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 container mx-auto px-6 md:px-20 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="text-accent-cyan">///</span> INITIATE LINK
        </h2>
        <p className="text-text-secondary text-lg mb-12">
            Available for consulting and engineering roles.
        </p>

        <div className="flex justify-center gap-8">
             <a href="mailto:contact@noman.ai" className="p-4 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent-cyan transition-all border border-white/5 hover:border-accent-cyan/30">
                <Mail className="w-6 h-6" />
             </a>
             <a href="https://github.com/noman-ai" className="p-4 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent-cyan transition-all border border-white/5 hover:border-accent-cyan/30">
                <Github className="w-6 h-6" />
             </a>
             <a href="https://linkedin.com/in/noman-ai" className="p-4 bg-white/5 rounded-full hover:bg-white/10 hover:text-accent-cyan transition-all border border-white/5 hover:border-accent-cyan/30">
                <Linkedin className="w-6 h-6" />
             </a>
        </div>
        
        <footer className="mt-20 text-xs text-text-muted font-mono">
            SYSTEM STATUS: ONLINE<br/>
            © 2025 NOMAN.AI ENGINEERING.
        </footer>
      </motion.div>
    </section>
  );
}
