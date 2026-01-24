"use client";

import Section from "@/components/ui/Section";
import ProjectCard from "@/components/ui/ProjectCard";
import { ArrowUpRight, ShieldCheck, BarChart3, Bot, Lock, Zap, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Project {
  _id: string;
  title: string;
  tagline?: string;
  desc: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        // API might return { status: 'success', data: [...] } or just [...]
        // Based on other files, it seems to be res.data or res.data.data
        // Let's assume standard response based on skills page
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []); 
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const featured = projects.find(p => p.featured);
  const others = projects.filter(p => !p.featured);

  if (loading) {
      return (
          <Section className="py-24 bg-[var(--bg)]" id="projects">
              <div className="container-max text-center">
                  <p className="text-[var(--muted)] animate-pulse">Loading Projects...</p>
              </div>
          </Section>
      );
  }

  if (projects.length === 0) {
      return null; // Don't show section if no projects
  }

  return (
    <section className="py-32 bg-background relative overflow-hidden" id="projects">
      <div className="container-max">
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-black font-heading text-foreground mb-8 leading-[1.1]">
            Documented Projects.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
             A list of software systems and tool implementations. 
             Every entry documented here includes a description of the technical decisions and trade-offs.
          </p>
        </div>

        <div className="flex flex-col gap-12">
            {/* Flagship Project */}
            {featured && (
                <ProjectCard project={featured} />
            )}

            {/* Grid of Other Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {others.map((p) => (
                    <ProjectCard key={p._id} project={p} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
