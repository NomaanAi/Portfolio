"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      className="group w-full block h-full"
    >
      <Link href={project.link || "#"} className="block h-full cursor-none">
        <div 
          className="relative h-full bg-surface border border-white/5 p-8 flex flex-col justify-between transition-colors duration-500 hover:border-white/20 hover:bg-surface-hover"
          data-cursor="hover"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold tracking-widest text-accent-secondary uppercase">
                {project.status}
              </span>
              <span className="text-xs font-mono text-accent-secondary opacity-50">
                0{index + 1}
              </span>
            </div>

            <h3 className="text-2xl font-bold font-heading text-foreground mb-4 group-hover:text-white transition-colors">
              {project.title}
            </h3>

            <p className="text-accent-secondary text-base leading-relaxed mb-8">
              {project.description}
            </p>
          </div>

          <div>
             <div className="flex flex-wrap gap-2 mb-6">
               {project.techStack?.map((t) => (
                 <span key={t} className="text-[10px] font-bold tracking-wider text-accent-secondary border border-white/10 px-2 py-1 rounded-sm uppercase">
                   {t}
                 </span>
               ))}
             </div>
             
             <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                VIEW CASE STUDY <span>→</span>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
