"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, Terminal } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-20 container mx-auto">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-accent-cyan/20 bg-accent-cyan/5 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">System Operational</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          <span className="block text-white">INTELLIGENCE</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white/50">ENGINEER.</span>
        </h1>

        <p className="text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
           Designing autonomous systems and production-grade neural architectures. 
           Bridging the gap between theoretical research and scalable reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
           <Link 
             href="#projects"
             className="group px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-accent-cyan hover:text-white transition-colors flex items-center gap-2"
           >
              View Protocols
              <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
           
           <a 
             href="/resume.pdf" // Ensure this file exists in public/ or is handled
             className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
           >
              Data Packet (CV)
           </a>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-6 md:left-20 flex gap-4 items-center"
      >
         <ArrowDown className="w-5 h-5 animate-bounce" />
         <span className="text-xs font-mono uppercase tracking-widest">Scroll to Initiate</span>
      </motion.div>
    </section>
  );
}
