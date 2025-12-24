"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Trash2, Edit2, Check, X, Star, Github, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  _id: string;
  title: string;
  tagline?: string;
  desc: string;
  problem?: string;
  challenges?: string;
  solution?: string;
  architecture?: string;
  outcome?: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  status: "Completed" | "In Progress" | "Building";
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects");
      // Assuming response format: { status: 'success', data: { data: [...] } }
      // Or just data: [...] based on skill controller
      const list = res.data.data?.data || res.data.data?.projects || res.data.data || [];
      setProjects(list);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentProject({ 
        featured: false, 
        status: "Completed", 
        stack: [],
        order: 0 
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
       console.error("Delete failed", error);
    }
  };

  const handleSave = async (data: Partial<Project>) => {
     try {
        if (data._id) {
            // Update
            const res = await api.patch(`/projects/${data._id}`, data);
            const updated = res.data.data?.data || res.data.data; // normalization
            setProjects(projects.map(p => p._id === updated._id ? updated : p));
        } else {
            // Create
            const res = await api.post("/projects", data);
            const newProject = res.data.data?.data || res.data.data;
            setProjects([...projects, newProject]);
        }
        setIsEditing(false);
        setCurrentProject({});
     } catch (error) {
         console.error("Save failed", error);
         alert("Failed to save project. Check fields.");
     }
  };

  if (loading) return <div>Loading Projects...</div>;

  if (isEditing) {
      return (
          <ProjectForm 
            initialData={currentProject} 
            onSave={handleSave} 
            onCancel={() => { setIsEditing(false); setCurrentProject({}); }} 
          />
      )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects Manager</h1>
        <button 
           onClick={handleCreate}
           className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition"
        >
            <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-card border border-border/50 p-6 rounded-lg flex items-start justify-between group hover:border-border transition-colors">
             <div>
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    {project.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                        {project.status}
                    </span>
                </div>
                <p className="text-muted-foreground mt-1 max-w-2xl">{project.tagline || project.desc.substring(0, 100) + "..."}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                    {project.stack.map(tech => (
                        <span key={tech} className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded">{tech}</span>
                    ))}
                </div>
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                    {project.liveUrl && <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> Live</span>}
                    {project.githubUrl && <span className="flex items-center gap-1"><Github className="w-3 h-3"/> Code</span>}
                </div>
             </div>

             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                <button onClick={() => handleEdit(project)} className="p-2 hover:bg-secondary rounded-md text-blue-400">
                        <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project._id)} className="p-2 hover:bg-secondary rounded-md text-red-400">
                        <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed border-border">
            No projects yet.
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectForm({ initialData, onSave, onCancel }: { 
    initialData: Partial<Project>, 
    onSave: (data: Partial<Project>) => void,
    onCancel: () => void 
}) {
    const [data, setData] = useState(initialData);
    const [stackInput, setStackInput] = useState(initialData.stack?.join(", ") || "");
    const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stackArray = stackInput.split(",").map(s => s.trim()).filter(Boolean);
        onSave({ ...data, stack: stackArray });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl max-w-5xl mx-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-border/40 bg-secondary/5">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-foreground">{data._id ? "Edit Project" : "New Project"}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Configure project details and case study content.</p>
                </div>
                <button type="button" onClick={onCancel} className="p-2 hover:bg-secondary rounded-full transition-colors"><X className="w-5 h-5 text-muted-foreground hover:text-foreground"/></button>
            </div>

            <div className="p-8 space-y-10">
                {/* SECTION 1: Core Info */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-primary/50"></span> Core Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Project Title</label>
                            <input 
                                required 
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-heading font-bold text-lg" 
                                value={data.title || ""} 
                                onChange={e => setData({...data, title: e.target.value})} 
                                placeholder="e.g. Neural Architecture Search"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Tagline</label>
                            <input 
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                                value={data.tagline || ""} 
                                onChange={e => setData({...data, tagline: e.target.value})} 
                                placeholder="Short, punchy description"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Short Description</label>
                        <textarea 
                            required 
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-y leading-relaxed" 
                            value={data.desc || ""} 
                            onChange={e => setData({...data, desc: e.target.value})} 
                            placeholder="Brief overview of what this project does..."
                        />
                    </div>
                </section>

                {/* SECTION 2: Links & Tech */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                         <span className="w-8 h-[1px] bg-primary/50"></span> Links & Technology
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Live URL</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                <input 
                                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm" 
                                    value={data.liveUrl || ""} 
                                    onChange={e => setData({...data, liveUrl: e.target.value})} 
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                         <div className="space-y-3">
                            <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Github URL</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                <input 
                                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm" 
                                    value={data.githubUrl || ""} 
                                    onChange={e => setData({...data, githubUrl: e.target.value})} 
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Tech Stack</label>
                        <input 
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm" 
                            value={stackInput} 
                            onChange={e => setStackInput(e.target.value)} 
                            placeholder="Comma separated (e.g. React, Next.js, Node.js)" 
                        />
                        <p className="text-xs text-muted-foreground ml-1">technologies used to build this project.</p>
                    </div>
                </section>

                {/* SECTION 3: Deep Dive */}
                <section className="border border-border/50 rounded-xl overflow-hidden bg-secondary/5">
                    <button 
                        type="button" 
                        onClick={() => setIsDeepDiveOpen(!isDeepDiveOpen)}
                        className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                    >
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                             Deep Dive Details <span className="text-xs text-muted-foreground font-normal normal-case">(Optional Case Study)</span>
                        </h3>
                        <div className={cn("transition-transform duration-200", isDeepDiveOpen ? "rotate-180" : "")}>
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </button>
                    
                    {isDeepDiveOpen && (
                        <div className="p-6 pt-0 grid grid-cols-1 gap-6 animate-in slide-in-from-top-2 duration-200">
                             <div className="h-px bg-border/50 mb-4"></div>
                             {['problem', 'challenges', 'solution', 'architecture', 'outcome'].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">{field}</label>
                                    <textarea 
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] text-sm leading-relaxed" 
                                        // @ts-ignore
                                        value={data[field] || ""} 
                                        // @ts-ignore
                                        onChange={e => setData({...data, [field]: e.target.value})} 
                                        placeholder={`Describe the ${field}...`}
                                    />
                                </div>
                             ))}
                        </div>
                    )}
                </section>

                {/* SECTION 4: Meta */}
                <section className="bg-background border border-border rounded-xl p-6 flex flex-wrap gap-8 items-center justify-between shadow-sm">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={cn(
                            "w-6 h-6 rounded border flex items-center justify-center transition-colors shadow-sm",
                            data.featured ? "bg-primary border-primary text-primary-foreground" : "bg-secondary border-border group-hover:border-primary/50"
                        )}>
                            {data.featured && <Check className="w-4 h-4" />}
                        </div>
                        <input type="checkbox" checked={data.featured || false} onChange={e => setData({...data, featured: e.target.checked})} className="hidden" />
                        <span className="font-bold text-foreground">Featured Project</span>
                    </label>
                    
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                        <select 
                            className="bg-secondary/30 border border-border rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer hover:bg-secondary/50 transition-colors"
                            value={data.status || "Completed"}
                            // @ts-ignore
                            onChange={e => setData({...data, status: e.target.value})}
                        >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Building">Building</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Order</label>
                        <input 
                            type="number" 
                            className="w-20 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/50 outline-none text-center" 
                            value={data.order || 0} 
                            onChange={e => setData({...data, order: parseInt(e.target.value)})} 
                        />
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/40 bg-secondary/5 flex justify-end gap-4 rounded-b-xl">
                <button type="button" onClick={onCancel} className="px-6 py-3 hover:bg-secondary rounded-lg font-medium transition-colors text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">Save Project</button>
            </div>
        </form>
    );
}
