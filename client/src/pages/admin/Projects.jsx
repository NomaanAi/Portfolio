
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Github, ExternalLink, ArrowUp, Star } from "lucide-react";
import SEO from "../../components/SEO";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    status: "draft",
    featured: false,
    order: 0,
    problemStatement: "",
    whyThisProject: "",
    solutionOverview: "",
    systemDesign: "",
    architectureDiagramUrl: "",
    techDecisions: "",
    workflow: "",
    challenges: "",
    outcomes: "",
    futureImprovements: "",
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const loadProjects = async () => {
    try {
      // Use admin endpoint to get drafts too
      const res = await axios.get(`${API_BASE}/api/projects/admin/all`, authConfig);
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to load projects", error);
      // Fallback
      if (error.response?.status === 404) {
         try {
             const res = await axios.get(`${API_BASE}/api/projects`);
             setProjects(res.data);
         } catch(e) {}
      }
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
      status: "draft",
      featured: false,
      order: 0,
      problemStatement: "",
      whyThisProject: "",
      solutionOverview: "",
      systemDesign: "",
      architectureDiagramUrl: "",
      techDecisions: "",
      workflow: "",
      challenges: "",
      outcomes: "",
      futureImprovements: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = { ...form, order: Number(form.order) };
    if (typeof payload.techStack === 'string') {
        payload.techStack = payload.techStack.split(",").map(t => t.trim()).filter(Boolean);
    }

    try {
      if (form.id) {
        await axios.put(`${API_BASE}/api/projects/${form.id}`, payload, authConfig);
        setMessage("Project updated successfully");
      } else {
        await axios.post(`${API_BASE}/api/projects`, payload, authConfig);
        setMessage("Project created successfully");
      }
      resetForm();
      await loadProjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving project");
    }
  };

  const handleEdit = (p) => {
    setForm({
      id: p._id,
      title: p.title,
      description: p.description,
      techStack: (p.techStack || []).join(", "),
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      status: p.status || "draft",
      featured: p.featured || false,
      order: p.order || 0,
      problemStatement: p.problemStatement || "",
      whyThisProject: p.whyThisProject || "",
      solutionOverview: p.solutionOverview || "",
      systemDesign: p.systemDesign || "",
      architectureDiagramUrl: p.architectureDiagramUrl || "",
      techDecisions: p.techDecisions || "",
      workflow: p.workflow || "",
      challenges: p.challenges || "",
      outcomes: p.outcomes || "",
      futureImprovements: p.futureImprovements || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${API_BASE}/api/projects/${id}`, authConfig);
      setMessage("Project deleted successfully");
      await loadProjects();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting project");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <SEO title="Manage Projects | Noman.dev" description="Create and edit projects." />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold">Projects</h1>
           <p className="text-slate-400 mt-1">Showcase your best work.</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-lg">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block">Total Projects</span>
            <span className="text-xl font-bold text-accent">{projects.length}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {isEditing ? <Edit2 size={20} className="text-accent" /> : <Plus size={20} className="text-accent" />}
                {isEditing ? "Edit Project" : "New Project"}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Project Name"
                    required
                  />
                </div>
                 <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Order (Priority)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="flex items-center pt-6">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 bg-backgroundDark text-accent focus:ring-accent"
                      />
                      <span className="text-sm text-slate-300">Featured on Home</span>
                   </label>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] text-slate-100 placeholder-slate-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Tech Stack (comma separated)</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">GitHub URL</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Live URL</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

               {/* Case Study Section */}
               <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-lg font-bold mb-4 text-slate-200">Case Study Details</h3>
                  <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1 block">Problem Statement</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[80px] text-slate-100"
                          value={form.problemStatement}
                          onChange={(e) => setForm({ ...form, problemStatement: e.target.value })}
                          placeholder="What problem does this project solve?"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Why This Project?</label>
                            <textarea
                              className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[80px] text-slate-100"
                              value={form.whyThisProject}
                              onChange={(e) => setForm({ ...form, whyThisProject: e.target.value })}
                              placeholder="Motivation..."
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Solution Overview</label>
                            <textarea
                              className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[80px] text-slate-100"
                              value={form.solutionOverview}
                              onChange={(e) => setForm({ ...form, solutionOverview: e.target.value })}
                              placeholder="High level solution..."
                            />
                          </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1 block">System Design / Architecture</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[120px] text-slate-100 font-mono"
                          value={form.systemDesign}
                          onChange={(e) => setForm({ ...form, systemDesign: e.target.value })}
                          placeholder="Microservices, data flow, etc..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400 mb-1 block">Architecture Diagram URL (Optional)</label>
                        <input
                          className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100"
                          value={form.architectureDiagramUrl}
                          onChange={(e) => setForm({ ...form, architectureDiagramUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Tech Decisions</label>
                            <textarea
                              className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] text-slate-100"
                              value={form.techDecisions}
                              onChange={(e) => setForm({ ...form, techDecisions: e.target.value })}
                              placeholder="Why React? Why Mongo?"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Workflow</label>
                            <textarea
                              className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] text-slate-100"
                              value={form.workflow}
                              onChange={(e) => setForm({ ...form, workflow: e.target.value })}
                              placeholder="Step 1, Step 2..."
                            />
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Challenges</label>
                            <textarea
                              className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] text-slate-100"
                              value={form.challenges}
                              onChange={(e) => setForm({ ...form, challenges: e.target.value })}
                              placeholder="Key engineering challenges..."
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-400 mb-1 block">Outcomes</label>
                            <textarea
                              className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] text-slate-100"
                              value={form.outcomes}
                              onChange={(e) => setForm({ ...form, outcomes: e.target.value })}
                              placeholder="Results achieved..."
                            />
                          </div>
                      </div>
                  </div>
               </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-accent/20"
              >
                {isEditing ? "Update Project" : "Create Project"}
              </button>
            </form>
          </div>
          
           {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border text-xs text-center ${message.includes("Error") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}
            >
              {message}
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Project List</h2>
          <div className="grid grid-cols-1 gap-4">
            {projects.map((p) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex flex-col sm:flex-row gap-4 p-5 bg-card/50 backdrop-blur-sm border rounded-xl hover:border-accent/40 hover:bg-card transition-all duration-300 ${p.status !== 'published' ? 'border-dashed border-slate-700 opacity-70' : 'border-border'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                       {p.title} 
                       {p.featured && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                     </h3>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                        {p.status}
                     </span>
                     <div className="flex gap-2 ml-auto sm:ml-2">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Github size={14}/></a>}
                        {p.liveUrl && <a href={p.liveUrl} target="_blank" className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-accent hover:bg-slate-700 transition-colors"><ExternalLink size={14}/></a>}
                     </div>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">{p.description}</p>
                   <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono">
                      Order: {p.order}
                   </div>
                  <div className="flex flex-wrap gap-2">
                    {p.techStack.map(t => (
                        <span key={t} className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700 text-[10px] text-slate-300 font-mono">
                            {t}
                        </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex sm:flex-col gap-2 justify-start sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-4">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                    <p>No projects found.</p>
                    <p className="text-xs mt-1 text-slate-600">Create your first project on the left.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
