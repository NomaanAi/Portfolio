"use client";

import { motion } from "framer-motion";
import { variants } from "@/lib/animations";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function SkillsPreview() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        // Backend returns simple array or { status: 'success', data: { skills: [] } }
        // Let's assume standard response wrapper based on previous files
        setSkills(response.data.data.skills || []);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return null; // Or a skeleton
  if (skills.length === 0) return null;

  return (
    <section className="py-40 bg-background border-t border-foreground/5">
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
           
           {/* Sticky Header */}
           <div className="lg:col-span-1">
             <div className="lg:sticky lg:top-32">
               <h2 className="text-xs font-mono text-accent-secondary tracking-[0.2em] uppercase mb-4">
                 // CAPABILITIES_
               </h2>
               <h3 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-8">
                 Technical <br /> <span className="text-foreground/20">Arsenal</span>
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
                   key={skill._id || i}
                   variants={variants.fadeInUp}
                   className="group border-b border-foreground/10 pb-6 hover:border-foreground/40 transition-colors"
                 >
                   <span className="text-xs font-mono text-foreground/30 mr-4">0{i+1}</span>
                   <span className="text-2xl font-medium text-foreground group-hover:pl-4 transition-all duration-300">
                     {skill.name}
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
