import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Calendar, Layers, Cpu, GitBranch, AlertTriangle, CheckCircle, Database } from "lucide-react";
import SEO from "../../components/SEO";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`py-12 border-b border-white/5 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
       {Icon && <Icon className="text-accent" size={24} />}
       <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
    </div>
    <div className="text-slate-400 leading-relaxed text-lg space-y-4">
      {children}
    </div>
  </section>
);

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        setError("Project not found or unpublished.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"/></div>;
  
  if (!project || error) return (
     <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-slate-200">Project Not Found</h1>
        <Link to="/" className="text-accent hover:underline mt-4 inline-block">Return Home</Link>
     </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-20 px-6"
    >
      <SEO title={`${project.title} - Case Study`} description={project.description} />
      
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        
        {/* Header */}
        <header className="mb-16 border-b border-white/10 pb-12">
           <div className="flex flex-wrap gap-3 mb-6">
              {project.techStack.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-300 font-mono">
                      {t}
                  </span>
              ))}
           </div>
           <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 tracking-tight">{project.title}</h1>
           <p className="text-xl text-slate-400 max-w-2xl">{project.description}</p>
        </header>

        {/* Section 1: Why This Project */}
        <Section title="Why This Project" icon={AlertTriangle}>
           <div className="grid md:grid-cols-2 gap-8">
              <div>
                 <h3 className="text-lg font-semibold text-slate-200 mb-2">The Problem</h3>
                 <p>{project.problemStatement || "No problem statement defined."}</p>
              </div>
              <div>
                 <h3 className="text-lg font-semibold text-slate-200 mb-2">Motivation</h3>
                 <p>{project.whyThisProject || "No motivation defined."}</p>
              </div>
           </div>
        </Section>

        {/* Section 2: What the System Does */}
        <Section title="What the System Does" icon={Layers}>
           <p className="whitespace-pre-line">{project.solutionOverview || "No solution overview provided."}</p>
        </Section>

        {/* Section 3: System Design */}
        <Section title="System Design" icon={Database}>
           <p className="whitespace-pre-line mb-6 font-mono text-sm bg-slate-900/50 p-6 rounded-xl border border-white/5">
             {project.systemDesign || "System design details not available."}
           </p>
           {project.architectureDiagramUrl && (
              <div className="my-8 rounded-xl overflow-hidden border border-slate-800">
                 <img src={project.architectureDiagramUrl} alt="System Architecture" className="w-full h-auto" />
                 <p className="text-center text-xs text-slate-500 p-2 bg-slate-900">High-level Architecture Diagram</p>
              </div>
           )}
        </Section>

        {/* Section 4: Technology & Design Decisions */}
        <Section title="Technology & Design Decisions" icon={Cpu}>
           <p className="whitespace-pre-line">{project.techDecisions || "No specific tech decisions documented."}</p>
        </Section>

        {/* Section 5: Workflow / Internal Working */}
        <Section title="Internal Workflow" icon={GitBranch}>
           <p className="whitespace-pre-line">{project.workflow || "Workflow details not provided."}</p>
        </Section>

        {/* Section 6: Challenges & Trade-offs */}
        <Section title="Challenges & Trade-offs" icon={AlertTriangle}>
           <p className="whitespace-pre-line">{project.challenges || "No challenges documented."}</p>
        </Section>

        {/* Section 7: Outcomes */}
        <Section title="Outcomes" icon={CheckCircle}>
           <p className="whitespace-pre-line">{project.outcomes || "No outcomes listed."}</p>
        </Section>
        
        {/* Section 8: Links & Proof */}
        <Section title="Links & Proof" icon={ExternalLink} className="border-none">
           <div className="flex gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-accent/20">
                   <ExternalLink size={18} /> View Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all border border-slate-700">
                   <Github size={18} /> Source Code
                </a>
              )}
           </div>
        </Section>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
           <p>Case study generated via CMS. Last updated {new Date().toLocaleDateString()}</p>
        </div>

      </div>
    </motion.div>
  );
}
