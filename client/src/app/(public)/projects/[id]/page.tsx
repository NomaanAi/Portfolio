"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, Github, Globe, AlertTriangle, Layers, Target, RotateCcw } from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get("/projects");
        const list = res.data.data?.data || res.data.data?.projects || res.data.data || [];
        const found = list.find((p: any) => p._id === id);
        setProject(found);
      } catch (error) {
        console.error("Failed to fetch project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse tracking-widest font-mono text-[10px] uppercase text-muted-foreground">Loading project documentation...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-foreground text-lg font-bold">Project documentation not found.</p>
        <Link href="/projects" className="text-primary hover:underline font-mono text-xs uppercase tracking-widest">Return to Archive</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-32 px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-24">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Archive
        </Link>

        {/* Header Section */}
        <section className="space-y-8">
            <div className="inline-flex items-center px-2 py-0.5 rounded border border-border bg-secondary/30 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                {project.status || "Completed"}
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-heading text-foreground tracking-tight leading-[0.9]">
                {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl">
                {project.tagline || project.summary}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
                {(project.techStack || project.stack || []).map((t: string) => (
                    <span key={t} className="px-2 py-1 border border-border bg-secondary/20 text-[10px] font-mono text-muted-foreground uppercase tracking-wider rounded">
                        {t}
                    </span>
                ))}
            </div>
            <div className="flex gap-8 pt-6">
                {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group">
                        Live Preview <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </a>
                )}
                {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group">
                        GitHub <Github className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
                    </a>
                )}
            </div>
        </section>

        {/* Dynamic Breakdown */}
        <div className="space-y-24 pb-20">
            
            {/* 1. Problem Statement */}
            <ProjectDetailSection 
                icon={<Target className="w-4 h-4" />} 
                label="Problem Statement"
                content={project.problem}
                textStyle="text-2xl md:text-3xl font-medium text-foreground leading-tight"
            />

            {/* 2. Critical Constraints */}
            <ProjectDetailSection 
                icon={<AlertTriangle className="w-4 h-4" />} 
                label="Hard Constraints"
                content={project.challenges}
                asBullets
            />

            {/* 3. Key Decisions & Architecture */}
            <ProjectDetailSection 
                icon={<Layers className="w-4 h-4" />} 
                label="Decisions & Architecture"
                content={project.architecture || project.solution}
                isCodeBlock
            />

            {/* 4. Result & Outcome */}
            <ProjectDetailSection 
                icon={<RotateCcw className="w-4 h-4" />} 
                label="Outcome & Results"
                content={project.outcome}
            />

            {/* 5. What Broke & Improvements */}
            <ProjectDetailSection 
                icon={<RotateCcw className="w-4 h-4" />} 
                label="Improvements & Learnings"
                labelColor="text-red-400 group-hover:text-red-500"
                content={project.learnings}
            />

        </div>
      </div>
    </main>
  );
}

function ProjectDetailSection({ 
    icon, 
    label, 
    content, 
    asBullets = false, 
    isCodeBlock = false,
    textStyle = "text-lg text-muted-foreground leading-relaxed",
    labelColor = "text-primary"
}: { 
    icon: React.ReactNode, 
    label: string, 
    content?: string, 
    asBullets?: boolean, 
    isCodeBlock?: boolean,
    textStyle?: string,
    labelColor?: string
}) {
    if (!content) return null;

    return (
        <section className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 group transition-all">
            <div className="space-y-4">
                <div className={cn("flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors", labelColor)}>
                    {icon} {label}
                </div>
                <div className="h-px w-8 bg-border transition-all group-hover:w-16" />
            </div>

            <div className="relative">
                {asBullets ? (
                    <ul className="grid grid-cols-1 gap-4">
                        {content.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i} className="flex gap-4 p-5 border border-border bg-secondary/5 rounded-2xl hover:bg-secondary/10 transition-colors">
                                <span className="text-primary font-mono text-[10px] opacity-40">0{i+1}</span>
                                <span className="text-sm text-muted-foreground leading-relaxed">{line.trim().replace(/^[•*-]\s*/, '')}</span>
                            </li>
                        ))}
                    </ul>
                ) : isCodeBlock ? (
                    <div className="p-6 bg-secondary/20 border border-border rounded-2xl font-mono text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {content}
                    </div>
                ) : (
                    <div className={textStyle}>
                        {content}
                    </div>
                )}
            </div>
        </section>
    );
}

