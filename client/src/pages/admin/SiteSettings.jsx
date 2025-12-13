import { useState, useEffect } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Save, Layout, Type } from "lucide-react";
import SEO from "../../components/SEO";



export default function SiteSettings() {
  const [settings, setSettings] = useState({
    hero: { title: "", subtitle: "" },
    about: { text: "" },
    sections: { projects: true, skills: true, resume: true }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/api/site-settings");
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/api/site-settings", settings);
      setMessage("Settings updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating settings");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <SEO title="Site Configuration | Admin" description="Manage site content." />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold">Site Configuration</h1>
           <p className="text-slate-400 mt-1">Manage global content and visibility.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        
        {/* Hero Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <Type className="text-accent" size={20}/> Hero Section
           </h2>
           <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Hero Title</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                  value={settings.hero?.title || ""}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                  placeholder="Building production-ready..."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Hero Subtitle</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none text-slate-100 placeholder-slate-500"
                  value={settings.hero?.subtitle || ""}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                  placeholder="AI/ML Engineer & Full-Stack Developer"
                />
              </div>
           </div>
        </div>

        {/* About Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <Layout className="text-accent" size={20}/> About Content
           </h2>
           <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">About Text (Markdown supported)</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg bg-backgroundDark border border-slate-700 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[150px] text-slate-100 placeholder-slate-500 font-mono"
                value={settings.about?.text || ""}
                onChange={(e) => setSettings({ ...settings, about: { ...settings.about, text: e.target.value } })}
                placeholder="I don't just write code..."
              />
           </div>
        </div>

        {/* Visibility Toggles */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <Layout className="text-accent" size={20}/> Section Visibility
           </h2>
           <div className="grid grid-cols-3 gap-4">
              {['projects', 'skills', 'resume'].map(section => (
                 <label key={section} className="flex items-center gap-3 p-3 border border-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.sections?.[section] !== false}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        sections: { ...settings.sections, [section]: e.target.checked } 
                      })}
                      className="w-4 h-4 rounded border-slate-700 bg-backgroundDark text-accent focus:ring-accent"
                    />
                    <span className="capitalize text-sm font-medium">{section}</span>
                 </label>
              ))}
           </div>
        </div>

        {message && (
            <div className={`p-3 rounded-lg border text-sm text-center ${message.includes("Error") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
              {message}
            </div>
        )}

        <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
          >
            <Save size={18} /> Save Configuration
        </button>

      </form>
    </motion.div>
  );
}
