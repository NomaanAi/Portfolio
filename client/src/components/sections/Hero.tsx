"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[50vh] flex items-center bg-background overflow-hidden pt-20">
      {/* Visual Anchor: Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max w-full relative z-10 px-6">
        <div className="max-w-4xl py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
          

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[0.95] mb-8 font-heading">
                Building and <br />
                Documenting Systems.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              I build and document software systems with a focus on reliability and clear trade-offs. 
              This portfolio summarizes my approach to technical problem solving and system design.
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex items-center gap-3 text-muted-foreground"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Available for technical initiatives</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
