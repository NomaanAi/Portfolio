
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="group relative h-full bg-slate-950 border border-slate-900 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none" />
      
      <div className="p-6 flex-1 flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-4">
             <div>
                <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50 mb-2 inline-block">
                  FULL-STACK
                </span>
                <Link to={`/projects/${project._id}`} className="block">
                  <h3 className="font-bold text-xl text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                </Link>
             </div>
             <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded hover:text-cyan-400 text-slate-400 transition-colors"><Github size={16}/></a>}
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded hover:text-cyan-400 text-slate-400 transition-colors"><ExternalLink size={16}/></a>}
             </div>
        </div>

        <Link to={`/projects/${project._id}`} className="flex-1 block group/text">
          <p className="text-sm text-slate-400 leading-relaxed mb-6 group-hover/text:text-slate-300 transition-colors">
            {project.description}
          </p>
        </Link>
        
        <div className="border-t border-slate-900 pt-4 mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.techStack?.slice(0,3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-500"
              >
                {tech}
              </span>
            ))}
            {project.techStack?.length > 3 && <span className="text-[10px] text-slate-600 self-center">+{project.techStack.length - 3}</span>}
          </div>
          
          <Link to={`/projects/${project._id}`} className="text-xs font-bold text-cyan-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
             Case Study <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
