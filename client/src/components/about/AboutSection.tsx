"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 container-max border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
           <h2 className="text-4xl md:text-5xl font-black font-heading mb-8">
             <span className="text-primary">///</span> ABOUT ME
           </h2>
           <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-light">
             I am a final year BCA student exploring software development and the application of data processing models. 
             My work involves building web applications and identifying technical approaches that address specific project needs.
           </p>
           <p className="text-lg text-muted-foreground leading-relaxed font-light">
             I focus on implementation using technologies like Next.js and MongoDB. 
             I am currently working with the integration of local data processing logic and open-source models into web interfaces.
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
             <div className="aspect-square bg-secondary/10 border border-border rounded-2xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                <div className="text-center p-8">
                    <span className="block text-6xl font-bold text-muted-foreground/20 mb-2">DEV</span>
                    <span className="block text-sm font-mono text-primary tracking-[0.3em] uppercase">Student & Builder</span>
                </div>
             </div>
        </motion.div>

      </div>
    </section>
  );
}
