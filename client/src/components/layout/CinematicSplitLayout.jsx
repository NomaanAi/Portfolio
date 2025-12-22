"use client";

import { motion } from "framer-motion";

export default function CinematicSplitLayout({ children, rightContent, title, subtitle }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative z-20">
        <div className="w-full max-w-xl px-8 py-12 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title && (
               <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-4 text-glow tracking-tight text-white">
                 {title}
               </h2>
            )}
            {subtitle && (
               <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                 {subtitle}
               </p>
            )}
            
            {children}
          </motion.div>
        </div>
      </div>
      
      {/* Right 3D/Visual */}
      <div className="hidden md:block w-1/2 h-screen fixed right-0 top-0 bg-[#02040a]">
         <div className="absolute inset-0 z-10 w-full h-full">
            {rightContent}
         </div>
         {/* Vignette for 3D */}
         <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-l from-transparent via-transparent to-background" />
      </div>
    </div>
  );
}
