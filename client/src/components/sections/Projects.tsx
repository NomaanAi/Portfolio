import Section from "@/components/ui/Section";
import { ArrowUpRight, ShieldCheck, BarChart3, Bot, Lock, Zap } from "lucide-react";

interface Project {
  title: string;
  problem: string;
  solution: string; // System-level
  credibility: string;
  tech: string[];
  icon: React.ElementType;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Enterprise Application Screener (RAG)",
    problem: "Recruiters spend 40% of their time manually parsing resumes against job descriptions.",
    solution: "Built a dual-pipeline RAG architecture. One pipeline vectorizes the job description (Context), the other matches candidate resumes via semantic similarity using pgvector.",
    credibility: "Processed 500+ resumes in production beta with < 2s retrieval latency.",
    tech: ["Python", "FastAPI", "PostgreSQL", "LangChain"],
    icon: ShieldCheck,
    featured: true,
  },
  {
    title: "Market Valuation Engine",
    problem: "Real-time asset pricing was lagging by 2-5 seconds due to sequential processing.",
    solution: "Microservices architecture using Redis Pub/Sub to decouple ingestion from valuation. Implemented XGBoost for parallel inference.",
    credibility: "50ms p99 latency at 10k messages/sec.",
    tech: ["XGBoost", "Redis", "Docker", "Node.js"],
    icon: BarChart3,
  },
  {
    title: "Portfolio Intelligence System",
    problem: "Static portfolios fail to demonstrate engineering capability to recruiters.",
    solution: "Full-stack Next.js app with a custom chatbot trained on my resume data. Uses edge caching for < 800ms Time To Interactive.",
    credibility: "100/100 Lighthouse Score.",
    tech: ["Next.js (App Router)", "TypeScript", "Tailwind", "Vercel SDK"],
    icon: Bot,
  },
];

export default function Projects() {
  const featured = projects.find(p => p.featured);
  const others = projects.filter(p => !p.featured);

  return (
    <Section className="py-24 bg-[var(--bg)] relative overflow-hidden" id="projects">
      <div className="container-max">
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-heading text-[var(--accent)] mb-4">
            Engineering Projects
          </h2>
          <p className="text-[var(--muted)] max-w-2xl text-lg">
             Systems built for scale, performance, and real-world value.
          </p>
        </div>

        <div className="flex flex-col gap-8">
            {/* Flagship Project */}
            {featured && (
                <div className="w-full border border-[var(--border)] bg-[var(--surface)] rounded-2xl p-8 md:p-12 hover:-translate-y-0.5 transition-transform duration-150 ease-out">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 text-[var(--accent)] font-mono text-xs uppercase tracking-wider font-bold">
                                <Zap className="w-4 h-4" /> Flagship System
                            </div>
                            <h3 className="text-3xl font-bold font-heading text-[var(--text)]">
                                {featured.title}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text)] mb-1">The Problem</h4>
                                    <p className="text-[var(--muted)] text-base leading-relaxed">{featured.problem}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text)] mb-1">Architecture & Solution</h4>
                                    <p className="text-[var(--muted)] text-base leading-relaxed">{featured.solution}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm font-mono text-[var(--muted)] pt-2">
                                {featured.tech.map(t => <span key={t} className="px-2 py-1 border border-[var(--border)] rounded">{t}</span>)}
                            </div>
                        </div>
                        
                        {/* Credibility Signal Box */}
                        <div className="w-full lg:w-80 shrink-0 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-6 flex flex-col justify-center">
                            <div className="mb-2 text-[var(--accent)]">
                                <featured.icon className="w-10 h-10" />
                            </div>
                            <div className="text-2xl font-bold text-[var(--text)] mb-2">
                                Production Signals
                            </div>
                            <p className="text-[var(--muted)] text-sm">
                                {featured.credibility}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid of Other Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {others.map((p, idx) => (
                    <div key={idx} className="border border-[var(--border)] bg-[var(--surface)] rounded-xl p-8 hover:-translate-y-0.5 transition-transform duration-150 ease-out flex flex-col h-full">
                         <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)] text-[var(--accent)]">
                                <p.icon className="w-6 h-6" />
                            </div>
                            <a href="#" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </a>
                        </div>
                        
                        <h3 className="text-xl font-bold text-[var(--text)] mb-4">{p.title}</h3>
                        
                        <div className="space-y-4 mb-8 flex-grow">
                             <div>
                                <h4 className="text-xs font-bold text-[var(--text)] uppercase opacity-70 mb-1">Problem</h4>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">{p.problem}</p>
                            </div>
                             <div>
                                <h4 className="text-xs font-bold text-[var(--text)] uppercase opacity-70 mb-1">Solution</h4>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">{p.solution}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--border)]">
                            <div className="flex items-center gap-2 mb-3">
                                <Lock className="w-3 h-3 text-[var(--accent)]" />
                                <span className="text-xs font-bold text-[var(--text)]">{p.credibility}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-mono text-[var(--muted)]">
                                 {p.tech.map(t => <span key={t} className="px-1.5 py-0.5 border border-[var(--border)] rounded">{t}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </Section>
  );
}
