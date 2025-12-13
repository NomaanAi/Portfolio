
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import SEO from "../../components/SEO";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    icon: "",
    level: 50,
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const loadSkills = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/skills`);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to load skills", error);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      icon: "",
      level: 50,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      name: form.name,
      icon: form.icon,
      level: form.level,
    };

    try {
      if (form.id) {
        await axios.put(`${API_BASE}/api/skills/${form.id}`, payload, authConfig);
        setMessage("Skill updated successfully");
      } else {
        await axios.post(`${API_BASE}/api/skills`, payload, authConfig);
        setMessage("Skill created successfully");
      }
      resetForm();
      await loadSkills();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving skill");
    }
  };

  const handleEdit = (s) => {
    setForm({
      id: s._id,
      name: s.name,
      icon: s.icon,
      level: s.level || 50,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await axios.delete(`${API_BASE}/api/skills/${id}`, authConfig);
      setMessage("Skill deleted successfully");
      await loadSkills();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting skill");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <SEO title="Manage Skills | Noman.dev" description="Create and edit skills." />
      
      <SEO title="Manage Skills | Noman.dev" description="Create and edit skills." />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold">Skills Management</h1>
           <p className="text-slate-400 mt-1">Add technical skills to populate your home page.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border px-4 py-2 rounded-lg">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block">Total Skills</span>
            <span className="text-xl font-bold text-accent">{skills.length}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {isEditing ? <Edit2 size={20} className="text-accent" /> : <Plus size={20} className="text-accent" />}
                {isEditing ? "Edit Skill" : "New Skill"}
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
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Skill Name</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="React"
                    required
                  />
                </div>

              </div>

               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Icon Name (Lucide)</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="Code, Database, etc."
                    required
                  />
                </div>
                <div>
                   <label className="text-xs font-medium text-slate-400 mb-1 block">Proficiency (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    placeholder="85"
                  />
                </div>
               </div>
              
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent to-purple-600 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-accent/20"
              >
                {isEditing ? "Update Skill" : "Add New Skill"}
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
          <h2 className="text-lg font-bold">Existing Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {skills.map((s) => (
                <motion.div
                  key={s._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-accent/40 hover:bg-card hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-purple-500/10 border border-white/5 flex items-center justify-center text-accent font-bold shadow-inner">
                          {/* Try to show Lucide icon if possible, else fallback to initials */}
                          {s.icon.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => handleEdit(s)} className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-slate-800 rounded-lg text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-end mb-2">
                           <h4 className="font-bold text-lg text-slate-100">{s.name}</h4>
                           <span className="text-xs font-mono text-accent">{s.level}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${s.level}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-accent to-purple-500" 
                          />
                        </div>
                         <p className="text-[10px] text-slate-500 mt-2 font-mono truncate">ICON: {s.icon}</p>
                      </div>
                  </div>
                </motion.div>
             ))}
            {skills.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                    <p>No skills added yet.</p>
                    <p className="text-xs mt-1 text-slate-600">Use the form to add your first skill.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
