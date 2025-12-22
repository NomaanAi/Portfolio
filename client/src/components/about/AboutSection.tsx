"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 container mx-auto px-6 md:px-20 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
           <h2 className="text-4xl md:text-5xl font-bold mb-8">
             <span className="text-accent-cyan">///</span> WHO I AM
           </h2>
           <p className="text-lg text-text-secondary leading-relaxed mb-6">
             I am a Machine Learning Engineer focused on the intersection of deep learning research and production software. 
             I don't just train models; I build the infrastructure that serves them at scale.
           </p>
           <p className="text-lg text-text-secondary leading-relaxed">
             My approach is rooted in first principles. Whether optimization of RAG pipelines or 
             architecting distributed inference systems, I prioritize efficiency, auditablity, and performance using PyTorch, 
             Kubernetes, and modern web standards.
           </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
           className="relative"
        >
             {/* Abstract grid element instead of photo if no photo available */}
             <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent opacity-50" />
                <div className="text-center p-8">
                    <span className="block text-6xl font-bold text-white/20 mb-2">AI</span>
                    <span className="block text-sm font-mono text-accent-cyan tracking-[0.3em] uppercase">Architecture</span>
                </div>
             </div>
        </motion.div>

      </div>
    </section>
  );
}
