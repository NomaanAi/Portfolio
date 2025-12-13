import { useState, useEffect } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, Clock } from "lucide-react";
import SEO from "../../components/SEO";



export default function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [versionLabel, setVersionLabel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");


  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get("/api/resume");
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("versionLabel", versionLabel);

    try {
      await api.post("/api/resume/upload", formData);
      setMessage("Resume uploaded successfully");
      setFile(null);
      setVersionLabel("");
      fetchResumes();
    } catch (err) {
      setMessage("Error uploading resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await api.put(`/api/resume/${id}/active`, {});
      fetchResumes();
    } catch (err) {
      console.error("Error setting active resume");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <SEO title="Resume Manager | Admin" description="Manage resume versions." />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold">Resume Management</h1>
           <p className="text-slate-400 mt-1">Upload and version control your resume.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8">
        
        {/* Upload Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Upload className="text-accent" size={20}/> Upload New
           </h2>
           <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Version Label</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. v2.0 - Full Stack"
                  required
                />
              </div>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:bg-slate-800/50 transition-colors">
                  <input 
                    type="file" 
                    id="resume" 
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <label htmlFor="resume" className="cursor-pointer flex flex-col items-center gap-2">
                      <FileText className="text-slate-500" size={32} />
                      <span className="text-sm text-slate-300">{file ? file.name : "Select PDF File"}</span>
                  </label>
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Version"}
              </button>
              
              {message && (
                <div className={`p-3 rounded-lg border text-xs text-center ${message.includes("Error") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
                  {message}
                </div>
              )}
           </form>
        </div>

        {/* Version List */}
        <div className="space-y-4">
           <h2 className="text-xl font-bold">Version History</h2>
           <div className="space-y-3">
              {resumes.map(r => (
                 <div key={r._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${r.isActive ? "bg-accent/10 border-accent" : "bg-card border-border hover:border-slate-700"}`}>
                    <div className="flex items-center gap-4">
                       <FileText size={24} className={r.isActive ? "text-accent" : "text-slate-600"} />
                       <div>
                          <h4 className={`font-bold text-sm ${r.isActive ? "text-accent" : "text-slate-200"}`}>{r.versionLabel}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                             <Clock size={10} /> {new Date(r.uploadedAt).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       {r.isActive ? (
                         <span className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                           <CheckCircle size={12} /> Active
                         </span>
                       ) : (
                         <button 
                           onClick={() => handleSetActive(r._id)}
                           className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                         >
                           Set Active
                         </button>
                       )}
                       <a href={`${import.meta.env.VITE_API_URL}/api/resume/active`} target="_blank" className="text-xs text-slate-500 hover:text-accent underline">
                         View
                       </a>
                    </div>
                 </div>
              ))}
              {resumes.length === 0 && <p className="text-slate-500 text-sm italic">No resumes uploaded.</p>}
           </div>
        </div>

      </div>
    </motion.div>
  );
}
