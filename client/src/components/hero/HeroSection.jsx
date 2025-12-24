"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: Content */}
      <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 relative z-10 py-32 lg:py-0 order-2 lg:order-1">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Engineering ease
        >
           <span className="block text-xs font-mono text-accent-secondary mb-6 tracking-[0.2em] uppercase">
             System Status: Online
           </span>

           <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tighter leading-[0.9] text-foreground mb-10">
             ENGINEER <br />
             <span className="text-accent-secondary">INTERFACE_</span>
           </h1>
           
           <p className="text-lg md:text-xl text-accent-secondary max-w-md mb-16 font-light leading-relaxed border-l border-foreground/10 pl-6">
             Building high-precision systems. <br />
             Focused on scalability, performance, and clear interaction models.
           </p>
           
           <div className="flex gap-8 items-center">
              <Link 
                href="/projects"
                className="group relative inline-flex items-center gap-2 overflow-hidden"
              >
                <span className="text-sm font-bold tracking-widest uppercase text-foreground">View Systems</span>
                <span className="w-full h-[1px] bg-foreground absolute bottom-0 left-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Link>
           </div>
        </motion.div>
      </div>

      {/* Right Column: Structural 3D */}
      <div className="relative w-full h-[50vh] lg:h-screen lg:sticky lg:top-0 order-1 lg:order-2 bg-background lg:border-l border-foreground/5 transition-colors duration-300">
         <div className="absolute inset-0">
           <Hero3D />
         </div>
         {/* Technical Overlay Lines */}
         <div className="absolute bottom-10 left-10 text-xs font-mono text-foreground/10 hidden lg:block">
            COORD: 34.0522° N, 118.2437° W <br />
            RENDER: WEBGL 2.0
         </div>
      </div>

    </section>
  );
}
