"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, Bot, Layout, ShieldCheck } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  metrics: string;
  icon: React.ElementType;
}

const projects: Project[] = [
  {
    title: "Enterprise Application Screening",
    description: "Automated candidate screening pipeline using RAG for semantic analysis of resumes against job descriptions.",
    tags: ["Python", "FastAPI", "React", "Vector DB"],
    metrics: "Reduced screening time by 90%",
    icon: ShieldCheck,
  },
  {
    title: "Real-Time Market Valuation Engine",
    description: "High-throughput evaluation system using XGBoost for instant pricing estimates based on live market data streams.",
    tags: ["Scikit-Learn", "XGBoost", "FastAPI", "Redis"],
    metrics: "< 50ms Inference Latency",
    icon: BarChart3,
  },
  {
    title: "Portfolio Intelligence System",
    description: "Next.js architecture serving this site, featuring a custom RAG-based assistant with session management.",
    tags: ["Next.js 14", "TypeScript", "Tailwind", "RAG"],
    metrics: "100/100 Lighthouse Performance",
    icon: Bot,
  },
];

export default function Projects() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="projects">
      <div className="container-wide">
        <div className="mb-16 flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-heading">
            Engineering <span className="text-accent">Intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Selected works that bridge the gap between complex AI systems and intuitive user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-full bg-surface border border-surface-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Card Header (Product UI Mockup feel) */}
              <div className="h-48 bg-gradient-to-br from-surface-hover to-background border-b border-surface-border p-6 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 to-transparent" />
                   <project.icon className="w-16 h-16 text-accent/80 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                   
                   {/* Abstract Data Viz Bars */}
                   <div className="absolute bottom-4 left-4 right-4 flex gap-1.5 opacity-40 items-end h-8">
                      <div className="w-1.5 h-1/3 bg-foreground/20 rounded-t-sm" />
                      <div className="w-1.5 h-2/3 bg-foreground/30 rounded-t-sm" />
                      <div className="w-1.5 h-1/2 bg-foreground/20 rounded-t-sm" />
                      <div className="w-1.5 h-full bg-accent/40 rounded-t-sm" />
                      <div className="w-1.5 h-3/4 bg-foreground/20 rounded-t-sm" />
                   </div>
              </div>

              {/* Card Content */}
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold font-heading group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <a href="#" className="p-2 rounded-full hover:bg-surface-hover transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                  </a>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-surface-border">
                   <div className="flex flex-wrap gap-2">
                     {project.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded bg-surface border border-surface-border text-muted-foreground">
                            {tag}
                        </span>
                     ))}
                   </div>
                   <div className="text-xs font-mono text-accent font-semibold">
                      {project.metrics}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
