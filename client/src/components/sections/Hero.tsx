"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 lg:px-8 bg-background">
      {/* Removed Cinematic Fog/Glow for cleanliness */}

      <div className="container-wide relative z-10 grid lg:grid-cols-2 gap-16 items-center h-full pt-12 lg:pt-0">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-surface-border bg-surface/50 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2.5" />
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">Full-Stack AI Engineer</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold font-heading tracking-tight leading-[1.1] text-foreground">
            Scalable Systems, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
              Reliable Intelligence.
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground/90 max-w-lg leading-relaxed font-normal">
            Specializing in RAG pipelines, inference optimization, and production-grade full-stack architecture.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <button className="px-8 py-3 bg-foreground text-background border border-foreground rounded-md font-medium transition-all duration-300 hover:bg-background hover:text-foreground">
              <span className="tracking-wide text-sm font-medium">View Projects</span>
            </button>
            <button className="px-8 py-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide">
              Contact Me
            </button>
          </div>
        </motion.div>

        {/* Right Visual - Seamless Blend */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1.5, delay: 0.2 }}
           className="relative h-[600px] lg:h-[800px] w-full flex items-center justify-center lg:justify-end pointer-events-none"
        >
            <div className="relative w-full h-full">
                 {/* Main Image - Removed complex mask to prevent build crash, using vignettes instead */}
                 <div className="absolute inset-0 z-10">
                     <Image
                        src="/robot-hero.png"
                        alt="AI Interface"
                        fill
                        className="object-contain object-right opacity-90 mix-blend-lighten"
                        priority
                     />
                 </div>
                 
                 {/* Vignette Overlay to ensure seamless edge */}
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                 <div className="absolute inset-0 bg-gradient-to-l from-background/20 via-transparent to-background z-20" />
            </div>
        </motion.div>
      </div>
    </section>
  );
}
