"use client";

import { ArrowUpRight, Code2, Zap, Terminal } from "lucide-react";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  summary?: string;
  tagline?: string;
  desc: string;
  techStack?: string[];
  stack?: string[]; // handle both names
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const tech = project.techStack || project.stack || [];
  
  // Flagship/Featured Card
  if (project.featured) {
    return (
      <Link href={`/projects/${project._id}`} className="block w-full group">
          <div className="w-full border border-border bg-secondary/10 rounded-3xl p-8 md:p-12 transition-all duration-500 ease-out hover:border-primary/30 hover:bg-secondary/20 hover:shadow-2xl hover:shadow-primary/5">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                  <Zap className="w-3 h-3" /> Primary Project
                </div>
                <h3 className="text-4xl md:text-5xl font-black font-heading text-foreground group-hover:text-primary transition-colors leading-[1.1]">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                  {project.tagline || project.summary || project.desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border border-border bg-background rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                 <div className="flex gap-4 pt-6">
                     <span className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:gap-3 transition-all">
                        Project Details <ArrowUpRight className="w-4 h-4 text-primary" />
                     </span>
                 </div>
              </div>
            </div>
          </div>
      </Link>
    );
  }

  // Standard Card
  return (
    <Link href={`/projects/${project._id}`} className="block h-full group">
      <div className="border border-border bg-secondary/5 rounded-2xl p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:bg-secondary/10 hover:shadow-xl flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className="p-3 bg-background rounded-xl border border-border text-primary group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
          {project.tagline || project.summary || project.desc}
        </p>

        <div className="pt-6 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[9px] font-mono text-muted-foreground uppercase border border-border rounded bg-background"
              >
                {t}
              </span>
            ))}
            {tech.length > 3 && (
                <span className="text-[9px] font-mono text-muted-foreground/50 self-center">+{tech.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

