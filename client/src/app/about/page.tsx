"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
           <h1 className="text-5xl md:text-7xl font-bold font-heading mb-12 text-foreground">
             About <span className="text-accent-secondary">Me.</span>
           </h1>
           
           <div className="space-y-12 text-lg md:text-xl text-accent-secondary leading-relaxed border-l-2 border-white/5 pl-8 md:pl-12">
             <p>
               I am a dedicated Full Stack Engineer with a passion for building robust, scalable web applications. 
               My journey began with a curiosity for how things work, leading me to dive deep into the world of software development.
             </p>
             <p>
               Over the years, I have honed my skills in modern web technologies, focusing on the <strong className="text-foreground">MERN stack (MongoDB, Express, React, Node.js)</strong> and 
               Next.js ecosystem. I believe in writing clean, maintainable code that not only solves problems but also provides 
               an exceptional user experience.
             </p>
             <p>
               When I'm not coding, I'm exploring new technologies, contributing to open source, or refining my design sensibilities. 
               I strive for perfection in every pixel and every function.
             </p>
           </div>
           
           <div className="mt-20">
             <h3 className="text-foreground font-bold text-2xl mb-8">Experience</h3>
             {/* Placeholder for Timeline - kept minimal for now */}
             <div className="border border-white/10 p-8 bg-surface">
                <span className="text-sm font-bold tracking-widest text-accent-secondary uppercase mb-2 block">2023 - Present</span>
                <h4 className="text-xl font-bold text-foreground mb-2">Senior Frontend Engineer</h4>
                <p className="text-accent-secondary text-sm">Freelance / Contract</p>
             </div>
           </div>
        </motion.div>
      </div>
    </main>
  );
}
