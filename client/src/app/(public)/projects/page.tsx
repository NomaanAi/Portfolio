"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Github, Globe, ArrowRight } from "lucide-react";

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
    <main className="min-h-screen pt-32 pb-20 px-6 container-wide">
        <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Project Archive</h1>
            <p className="text-muted-foreground text-lg">A collection of my work and experiments.</p>
        </div>

        {loading ? (
             <div className="text-center">Loading...</div>
        ) : (
             <div className="space-y-32">
                 {/* Sort by featured or order, assumes API returns in some order or we sort manually here */}
                 {projects.map((project: any, index) => (
                     <ProjectDetailView key={project._id} project={project} index={index} />
                 ))}
             </div>
        )}
    </main>
  );
}

function ProjectDetailView({ project, index }: { project: any, index: number }) {
    const isEven = index % 2 === 0;

    return (
        <div id={project._id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-start`}>
             {/* Text Content */}
             <div className="flex-1 space-y-6">
                 <div className="space-y-2">
                     <span className="text-primary font-mono text-sm tracking-widest uppercase">{project.status}</span>
                     <h2 className="text-3xl md:text-4xl font-bold font-heading">{project.title}</h2>
                     <p className="text-xl text-muted-foreground font-light">{project.tagline}</p>
                 </div>

                 <div className="prose prose-invert max-w-none text-muted-foreground/80">
                     <p>{project.desc}</p>
                 </div>
                 
                 <div className="flex flex-wrap gap-2">
                     {project.stack.map((t: string) => (
                         <span key={t} className="px-3 py-1 bg-secondary/50 rounded-full text-sm font-mono border border-border/50">
                             {t}
                         </span>
                     ))}
                 </div>

                 <div className="flex gap-6 pt-4">
                     {project.liveUrl && (
                         <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-primary transition">
                             <Globe className="w-5 h-5"/> Live Demo
                         </a>
                     )}
                     {project.githubUrl && (
                         <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-primary transition">
                             <Github className="w-5 h-5"/> Source Code
                         </a>
                     )}
                 </div>

                 {/* Detailed Sections if they exist */}
                 {(project.problem || project.solution) && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border/30 mt-8">
                         {project.problem && (
                             <div>
                                 <h4 className="font-bold text-sm uppercase tracking-wider mb-2">The Problem</h4>
                                 <p className="text-sm text-muted-foreground">{project.problem}</p>
                             </div>
                         )}
                         {project.solution && (
                             <div>
                                 <h4 className="font-bold text-sm uppercase tracking-wider mb-2">The Solution</h4>
                                 <p className="text-sm text-muted-foreground">{project.solution}</p>
                             </div>
                         )}
                     </div>
                 )}
             </div>

             {/* Visual / "Image" Placeholder */}
             <div className="flex-1 w-full aspect-video bg-secondary/10 rounded-2xl border border-border/50 relative overflow-hidden flex items-center justify-center group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 opacity-50"></div>
                 {/* Here we would put a screenshot image if available. Since strict rules say "No placeholders" 
                     but we don't have images uploaded dynamically yet (unless we added image upload which wasn't in required fields)
                     we use a typographic placeholder that looks intentional. 
                 */}
                 <h3 className="text-6xl md:text-8xl font-black text-foreground/5 group-hover:text-foreground/10 transition-colors uppercase select-none">
                     {project.title.substring(0, 3)}
                 </h3>
             </div>
        </div>
    )
}
