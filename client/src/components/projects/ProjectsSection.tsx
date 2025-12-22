"use client";

import { PROJECTS } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

interface ProjectsSectionProps {
  limit?: number;
}

export default function ProjectsSection({ limit }: ProjectsSectionProps) {
  const visibleProjects = limit ? PROJECTS.slice(0, limit) : PROJECTS;

  if (visibleProjects.length === 0) {
    return (
      <section id="projects" className="py-24 relative z-10 w-full bg-background">
        <div className="container px-6 text-center md:text-left">
           {!limit && (
              <h2 className="text-4xl md:text-6xl font-bold font-heading mb-16 text-foreground">
                Selected <span className="text-accent-secondary">Work</span>
              </h2>
           )}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="border-l-2 border-white/10 pl-8 py-2"
          >
             <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-2">Work in Progress</h3>
             <p className="text-accent-secondary max-w-lg leading-relaxed text-sm">
               Projects are currently being documented and prepared for showcase. 
               Check back soon for case studies.
             </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative z-10 w-full bg-background pb-20">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
