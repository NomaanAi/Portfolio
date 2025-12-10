
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import DownloadCV from "../../components/DownloadCV.jsx";
import ProjectCard from "../../components/ProjectCard.jsx";
import Hero from "../../components/Hero.jsx";
import SEO from "../../components/SEO.jsx";
import { Server, Database, Cpu, Layout, ArrowLeft, ArrowRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Helper to group skills
const groupSkills = (metrics) => {
  const groups = {
    "Frontend & UI": ["React", "Vue", "Tailwind", "CSS", "HTML", "Javascript", "Typescript", "Next.js"],
    "Backend & Cloud": ["Node.js", "Express", "Python", "AWS", "Docker", "Firebase", "MongoDB", "SQL"],
    "AI & Machine Learning": ["TensorFlow", "PyTorch", "OpenCV", "NLP", "LLMs", "RAG", "Scikit-learn"],
    "Tools & DevOps": ["Git", "Linux", "CI/CD", "Postman", "Figma"]
  };
  
  const result = {};
  Object.keys(groups).forEach(k => result[k] = []);
  result["Other Tech"] = [];

  metrics.forEach(skill => {
    let placed = false;
    for (const [group, keywords] of Object.entries(groups)) {
       if (keywords.some(k => skill.name.toLowerCase().includes(k.toLowerCase())) || 
           (skill.category && skill.category === group) // enhanced check if we add category later
       ) {
         result[group].push(skill);
         placed = true;
         break;
       }
    }
    if (!placed) result["Other Tech"].push(skill);
  });
  
  return result;
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const [projectIndex, setProjectIndex] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, settingsRes] = await Promise.all([
           axios.get(`${API_BASE}/api/projects`),
           axios.get(`${API_BASE}/api/skills`),
           axios.get(`${API_BASE}/api/site-settings`)
        ]);
        // Filter featured or respect order if not handled by backend query (backend handles filtering published, but maybe we want featured only on home)
        // Requirement 3: Homepage shows featured + published projects only.
        const featuredProjects = projectsRes.data.filter(p => p.featured);
        setProjects(featuredProjects.length > 0 ? featuredProjects : projectsRes.data.slice(0,4)); // Fallback to latest 4 if no featured, or strict?
        // Let's strict: featured only. If none, maybe empty? Or fallback. Plan said "featured + published".
        // Backend `GET /api/projects` returns "published".
        
        setSkills(skillsRes.data);
        setGroupedSkills(groupSkills(skillsRes.data));
        setSiteSettings(settingsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!siteSettings) return null; // Loading state could be better but null avoids flash

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <SEO 
        title="Noman.dev | AI & Full-Stack Engineer" 
        description={siteSettings.hero?.subtitle || "Portfolio"}
      />
      
      <Hero settings={siteSettings.hero} />

      {/* Intro / About */}
      {siteSettings.sections?.about !== false && (
        <section className="grid md:grid-cols-[1.5fr,1fr] gap-12 items-start py-12 border-b border-slate-900/50">
          <motion.div variants={item}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-100">
               <span className="w-8 h-[2px] bg-cyan-500"></span> About The System
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-lg whitespace-pre-wrap">
              {siteSettings.about?.text || "Welcome to my portfolio."}
            </div>
          </motion.div>

          {/* Connector Section: How I Build (Static for now, could be dynamic later) */}
          <motion.div variants={item} className="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-900 pb-2">
               Engineering Philosophy
             </h3>
             <ul className="space-y-4">
               <li className="flex gap-3">
                 <div className="mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0" />
                 <div>
                    <h4 className="text-slate-200 font-bold text-sm">Architecture First</h4>
                    <p className="text-slate-500 text-xs mt-1">Scalability is planned, not patched.</p>
                 </div>
               </li>
               <li className="flex gap-3">
                 <div className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                 <div>
                    <h4 className="text-slate-200 font-bold text-sm">Full-Cycle Development</h4>
                    <p className="text-slate-500 text-xs mt-1">From data collection to deployment.</p>
                 </div>
               </li>
             </ul>
          </motion.div>
        </section>
      )}

      {/* Tech Stack - Grouped */}
      {siteSettings.sections?.skills !== false && (
        <section className="py-12 border-b border-slate-900/50">
          <motion.div variants={item} className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-slate-200">Technologies</h2>
             <span className="text-xs font-mono text-slate-500">{skills.length} MODULES LOADED</span>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                categorySkills.length > 0 && (
                  <motion.div key={category} variants={item} className="space-y-3">
                     <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">{category}</h3>
                     <div className="flex flex-wrap gap-2">
                        {categorySkills.map(s => (
                           <span key={s._id} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-slate-400" title={s.linkedProjects?.length > 0 ? `Used in ${s.linkedProjects.length} projects` : ''}>
                             {s.name} {s.linkedProjects?.length > 0 && <span className="ml-1 opacity-50">({s.linkedProjects.length})</span>}
                           </span>
                        ))}
                     </div>
                  </motion.div>
                )
             ))}
          </div>
        </section>
      )}

      {/* Projects Slider */}
      {siteSettings.sections?.projects !== false && (
      <section className="py-12 space-y-8">
        <motion.div variants={item} className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">Featured Systems</h2>
            <p className="text-slate-500 text-sm mt-1 font-mono">Curated selection of production-ready systems.</p>
          </div>
          <div className="hidden md:flex gap-4 items-center">
             <div className="flex gap-2">
               <button 
                 onClick={() => setProjectIndex(prev => Math.max(0, prev - 1))}
                 disabled={projectIndex === 0}
                 className="p-2 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:text-cyan-400 disabled:opacity-30"
               >
                 <ArrowLeft size={16}/>
               </button>
               <button 
                 onClick={() => setProjectIndex(prev => Math.min(projects.length - (window.innerWidth >= 768 ? 2 : 1), prev + 1))}
                 disabled={projects.length <= (window.innerWidth >= 768 ? 2 : 1) || projectIndex >= projects.length - (window.innerWidth >= 768 ? 2 : 1)}
                 className="p-2 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:text-cyan-400 disabled:opacity-30"
               >
                 <ArrowRight size={16}/>
               </button>
             </div>
             <a href="/projects" className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 text-sm font-medium transition-colors ml-4">
                View All <Server size={14}/>
             </a>
          </div>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div variants={item} className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
            <p className="text-slate-400 font-mono">
              No featured projects available.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {projects.slice(projectIndex, projectIndex + (window.innerWidth >= 768 ? 2 : 1)).map((p) => (
               <motion.div key={p._id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                 <ProjectCard project={p} />
               </motion.div>
             ))}
          </div>
        )}
      </section>
      )}
    </motion.div>
  );
}
