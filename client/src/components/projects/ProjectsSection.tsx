"use client";

import ProjectCard from "./ProjectCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

interface Project {
  _id: string;
  title: string;
  desc: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: string;
}

interface ProjectsSectionProps {
  limit?: number;
}

export default function ProjectsSection({ limit }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        // valid response: { status: "success", data: [...] }
        const projectsData = response.data.data;
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter or limit if needed (Backend typically handles sorting, but limit might be UI specific)
  // If limit is provided (e.g. for Home page), slice the result.
  const visibleProjects = limit && projects ? projects.slice(0, limit) : (projects || []);

  if (loading) {
    return (
        <section id="projects" className="relative z-10 w-full bg-background pb-20 pt-20">
             <div className="container px-6 text-center">
                 <p className="text-accent-secondary animate-pulse">Loading System Data...</p>
             </div>
        </section>
    );
  }

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
            className="border-l-2 border-foreground/10 pl-8 py-2"
          >
             <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-2">System Empty</h3>
             <p className="text-accent-secondary max-w-lg leading-relaxed text-sm">
               No projects initialized in the database. Access Admin Panel to deploy new units.
             </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative z-10 w-full bg-background pb-20">
      <div className="container px-6">
        {!limit && (
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-16 text-foreground">
            Selected <span className="text-accent-secondary">Work</span>
            </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <ProjectCard 
                key={project._id} 
                index={index} 
                project={{
                    ...project,
                    description: project.desc,
                    techStack: project.stack,
                    demoUrl: project.liveUrl,
                    status: project.status || "Completed"
                }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
