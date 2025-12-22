"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/animations";

const skills = [
  "React / Next.js",
  "Tailwind CSS",
  "Node.js / Express",
  "PostgreSQL / MongoDB",
  "TypeScript",
  "Framer Motion",
  "AWS / Docker"
];

export default function SkillsPreview() {
  return (
    <section className="py-40 bg-background border-t border-white/5">
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
           
           {/* Sticky Header */}
           <div className="lg:col-span-1">
             <div className="lg:sticky lg:top-32">
               <h2 className="text-xs font-mono text-accent-secondary tracking-[0.2em] uppercase mb-4">
                 // CAPABILITIES_
               </h2>
               <h3 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-8">
                 Technical <br /> <span className="text-white/20">Arsenal</span>
               </h3>
               <p className="text-accent-secondary leading-relaxed max-w-xs">
                 A robust set of tools optimized for performance, scalability, and maintainability.
               </p>
             </div>
           </div>
           
           {/* Scrolling List - Asymmetric */}
           <div className="lg:col-span-2">
             <motion.div 
                variants={variants.container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8"
             >
               {skills.map((skill, i) => (
                 <motion.div 
                   key={skill}
                   variants={variants.fadeInUp}
                   className="group border-b border-white/10 pb-6 hover:border-white/40 transition-colors"
                 >
                   <span className="text-xs font-mono text-white/30 mr-4">0{i+1}</span>
                   <span className="text-2xl font-medium text-foreground group-hover:pl-4 transition-all duration-300">
                     {skill}
                   </span>
                 </motion.div>
               ))}
             </motion.div>
           </div>

        </div>
      </div>
    </section>
  );
}
