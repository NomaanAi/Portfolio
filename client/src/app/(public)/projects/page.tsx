"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProjectCard from "@/components/ui/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data?.data || res.data.data?.projects || res.data.data || []);
      } catch (error) {
        console.error("Failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen py-32 px-6 container-max">
        <div className="mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-8 tracking-tighter">Project Archive</h1>
            <p className="text-muted-foreground text-xl max-w-2xl font-light">
                A list of software projects and technical documentation, focusing on architectural decisions and trade-offs.
            </p>
        </div>

        {loading ? (
             <div className="flex justify-center py-20 text-[var(--muted)]">Loading projects...</div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Sort by featured or order, assumes API returns in some order or we sort manually here */}
                 {projects.map((project: any) => (
                     <ProjectCard key={project._id} project={project} />
                 ))}
             </div>
        )}
    </main>
  );
}
