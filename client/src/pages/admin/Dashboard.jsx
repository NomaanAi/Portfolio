
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Upload, FileText, Code2, FolderGit2, Plus, Clock, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, lastProject: null });
  const [systemStatus, setSystemStatus] = useState("checking"); // checking, ok, error
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, healthRes] = await Promise.all([
          axios.get(`${API_BASE}/api/projects`),
          axios.get(`${API_BASE}/api/skills`),
          axios.get(`${API_BASE}/api/health`)
        ]);
        setStats({
          projects: projectsRes.data.length,
          skills: skillsRes.data.length,
          lastProject: projectsRes.data[0] || null,
        });
        setSystemStatus(healthRes.data.status === "ok" ? "ok" : "error");
      } catch (error) {
        console.error("Error loading stats", error);
        setSystemStatus("error");
      }
    };
    fetchStats();
  }, []);

  const uploadResume = async () => {
    if (!resumeFile) {
      setMessage("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      await axios.post(`${API_BASE}/api/resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("System: Resume updated successfully.");
    } catch (err) {
      setMessage("Error: Upload failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <SEO title="System Control | Noman.dev" description="Admin control panel." />

      <header className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider">System Control</h1>
          <p className="text-xs text-slate-500 mt-1">v2.4.0 • PRODUCTION</p>
        </div>
        <div className="flex gap-3">
           <Link to="/admin/projects" className="text-xs flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded border border-white/5 transition-colors">
              <Plus size={14}/> New Project
           </Link>
           <Link to="/admin/skills" className="text-xs flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded border border-white/5 transition-colors">
              <Plus size={14}/> New Skill
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-white/5 p-5 rounded-lg">
           <div className="flex justify-between items-start mb-4">
              <span className="text-xs text-slate-500 uppercase">Projects Published</span>
              <FolderGit2 className="text-cyan-500" size={16} />
           </div>
           <p className="text-3xl font-light text-slate-100">{stats.projects}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-white/5 p-5 rounded-lg">
           <div className="flex justify-between items-start mb-4">
              <span className="text-xs text-slate-500 uppercase">Skill Database</span>
              <Code2 className="text-purple-500" size={16} />
           </div>
           <p className="text-3xl font-light text-slate-100">{stats.skills}</p>
        </div>
        
        <div className="bg-slate-900/50 border border-white/5 p-5 rounded-lg">
           <div className="flex justify-between items-start mb-4">
              <span className="text-xs text-slate-500 uppercase">System Status</span>
              <Globe className={systemStatus === "ok" ? "text-emerald-500" : systemStatus === "error" ? "text-red-500" : "text-yellow-500"} size={16} />
           </div>
           <p className={`text-sm font-medium ${systemStatus === "ok" ? "text-emerald-400" : systemStatus === "error" ? "text-red-400" : "text-yellow-400"}`}>
              {systemStatus === "ok" ? "● Systems Nominal" : systemStatus === "checking" ? "○ Checking..." : "● System Error"}
           </p>
           <p className="text-xs text-slate-600 mt-2">Database: {systemStatus === "ok" ? "Connected" : systemStatus === "checking" ? "Pending" : "Unreachable"}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Content Overview */}
        <div className="border border-white/5 rounded-lg bg-slate-900/30 overflow-hidden">
           <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Latest Activity</h2>
           </div>
           <div className="p-4">
              {stats.lastProject ? (
                 <div className="group flex items-center justify-between p-3 hover:bg-white/5 border border-transparent hover:border-white/5 rounded transition-all">
                    <div>
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/20 mb-1 inline-block">PROJECT</span>
                       <h3 className="text-sm font-medium text-slate-200">{stats.lastProject.title}</h3>
                       <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{stats.lastProject.description}</p>
                    </div>
                    <Link to="/admin/projects" className="text-slate-600 group-hover:text-slate-300 transition-colors">
                       <ArrowRight size={14} />
                    </Link>
                 </div>
              ) : (
                 <p className="text-xs text-slate-500 p-2">No activity recorded.</p>
              )}
           </div>
        </div>

        {/* Resume Management */}
        <div className="border border-white/5 rounded-lg bg-slate-900/30">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
             <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
               <FileText size={14} className="text-slate-500"/> Active Resume
             </h2>
             <span className="text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">LIVE</span>
          </div>
          
          <div className="p-6 space-y-4">
             <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-slate-500 border border-white/10">
                    PDF
                 </div>
                 <div>
                    <a 
                      href={`${API_BASE}/uploads/resume.pdf`} 
                      target="_blank" 
                      className="text-sm text-slate-300 hover:text-cyan-400 hover:underline transition-colors block"
                    >
                      resume.pdf
                    </a>
                    <span className="text-xs text-slate-600 block mt-0.5">Asset served via CDN</span>
                 </div>
             </div>

             <div className="h-px bg-white/5 my-4" />

             <div>
                <input
                  type="file"
                  id="resume-upload"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden"
                  accept=".pdf"
                />
                <div className="flex gap-2">
                   <label 
                      htmlFor="resume-upload" 
                      className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs py-2 px-3 rounded border border-white/5 transition-all text-center truncate"
                   >
                     {resumeFile ? resumeFile.name : "Select File..."}
                   </label>
                   <button
                     onClick={uploadResume}
                     disabled={!resumeFile}
                     className="bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 text-xs py-2 px-4 rounded border border-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-semibold"
                   >
                     <Upload size={12} className="inline mr-1"/> Update
                   </button>
                </div>
             </div>
            
            {message && (
              <p className={`text-[10px] font-mono mt-2 ${message.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>
                {">"} {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
