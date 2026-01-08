"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, Code2 } from "lucide-react";
import dynamic from "next/dynamic";

const Sphere3D = dynamic(() => import("./Sphere3D"), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-20 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-accent-cyan/20 bg-accent-cyan/5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Open for Opportunities</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            <span className="block text-white">FULL STACK</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white/50">DEVELOPER.</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
             BCA Student & AI Enthusiast. Building modern web applications with Next.js and exploring the potential of open-source LLMs.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
             <Link 
               href="#projects"
               className="group px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-accent-cyan hover:text-white transition-colors flex items-center gap-2"
             >
                View My Work
                <Code2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
             
             <a 
               href="/resume.pdf" 
               className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
             >
                Download CV
             </a>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="h-[400px] w-full hidden lg:block"
        >
            <Sphere3D />
        </motion.div>

      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-6 md:left-20 flex gap-4 items-center"
      >
         <ArrowDown className="w-5 h-5 animate-bounce" />
         <span className="text-xs font-mono uppercase tracking-widest">Scroll to Explore</span>
      </motion.div>
    </section>
  );
}
