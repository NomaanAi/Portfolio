"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Activity } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative p-8 bg-surface border border-foreground/10 hover:border-accent-primary/50 transition-colors rounded-xl backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
         <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded border ${
             project.status === "Completed" ? "border-green-500/50 text-green-500" : "border-yellow-500/50 text-yellow-500"
         }`}>
             {project.status}
         </span>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent-primary transition-colors">
        {project.title}
      </h3>
      
      <p className="text-accent-secondary mb-6 leading-relaxed line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.techStack.map(tech => (
            <span key={tech} className="text-xs font-mono text-accent-primary/80 bg-accent-primary/10 px-2 py-1 rounded">
                {tech}
            </span>
        ))}
      </div>

      <div className="flex gap-4 mt-auto">
        {project.githubUrl && (
            <a href={project.githubUrl} className="text-accent-secondary hover:text-foreground flex items-center gap-2 text-sm font-bold">
                <Github className="w-4 h-4" /> Code
            </a>
        )}
        {project.demoUrl && (
            <a href={project.demoUrl} className="text-accent-secondary hover:text-foreground flex items-center gap-2 text-sm font-bold">
                <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
        )}
      </div>
    </motion.div>
  );
}
