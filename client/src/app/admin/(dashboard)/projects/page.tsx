"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Trash2, Edit2, Check, X, Star, Github, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonLabel } from "@/components/common/CommonLabel";
import { CommonTextarea } from "@/components/common/CommonTextarea";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonCard, CommonCardContent } from "@/components/common/CommonCard";
import { CommonAccordionItem } from "@/components/common/CommonAccordion";

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
        <CommonButton 
           onClick={handleCreate}
           className="gap-2"
        >
            <Plus className="w-4 h-4" /> Add Project
        </CommonButton>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <CommonCard key={project._id} className="p-6 flex items-start justify-between group hover:border-primary/50 transition-colors">
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
                <CommonButton variant="ghost" size="icon" onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-500 hover:bg-secondary">
                        <Edit2 className="w-4 h-4" />
                </CommonButton>
                <CommonButton variant="ghost" size="icon" onClick={() => handleDelete(project._id)} className="text-red-400 hover:text-red-500 hover:bg-secondary">
                        <Trash2 className="w-4 h-4" />
                </CommonButton>
            </div>
          </CommonCard>
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
    // removed manual isDeepDiveOpen state, using CommonAccordionItem internal state

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stackArray = stackInput.split(",").map(s => s.trim()).filter(Boolean);
        onSave({ ...data, stack: stackArray });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl max-w-5xl mx-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-border/40 bg-secondary/5">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-foreground">{data._id ? "Edit Project" : "New Project"}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Configure project details and case study content.</p>
                </div>
                <CommonButton type="button" variant="ghost" size="icon" onClick={onCancel} className="rounded-full"><X className="w-5 h-5 text-muted-foreground hover:text-foreground"/></CommonButton>
            </div>

            <div className="p-8 space-y-10">
                {/* SECTION 1: Core Info */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-primary/50"></span> Core Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Project Title</CommonLabel>
                            <CommonInput 
                                required 
                                className="font-heading font-bold text-lg" 
                                value={data.title || ""} 
                                onChange={e => setData({...data, title: e.target.value})} 
                                placeholder="e.g. Neural Architecture Search"
                            />
                        </div>
                        <div className="space-y-3">
                            <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Tagline</CommonLabel>
                            <CommonInput 
                                className="" 
                                value={data.tagline || ""} 
                                onChange={e => setData({...data, tagline: e.target.value})} 
                                placeholder="Short, punchy description"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Short Description</CommonLabel>
                        <CommonTextarea 
                            required 
                            className="min-h-[120px] resize-y leading-relaxed" 
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
                            <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Live URL</CommonLabel>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <CommonInput 
                                    className="pl-10 font-mono text-sm" 
                                    value={data.liveUrl || ""} 
                                    onChange={e => setData({...data, liveUrl: e.target.value})} 
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                         <div className="space-y-3">
                            <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Github URL</CommonLabel>
                            <div className="relative">
                                <Github className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <CommonInput 
                                    className="pl-10 font-mono text-sm" 
                                    value={data.githubUrl || ""} 
                                    onChange={e => setData({...data, githubUrl: e.target.value})} 
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">Tech Stack</CommonLabel>
                        <CommonInput 
                            className="font-mono text-sm" 
                            value={stackInput} 
                            onChange={e => setStackInput(e.target.value)} 
                            placeholder="Comma separated (e.g. React, Next.js, Node.js)" 
                        />
                        <p className="text-xs text-muted-foreground ml-1">technologies used to build this project.</p>
                    </div>
                </section>

                {/* SECTION 3: Deep Dive */}
                <section className="rounded-xl overflow-hidden bg-secondary/5 border border-border/50">
                    <CommonAccordionItem
                        title={
                            <div className="flex items-center gap-2 px-4">
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                                     Deep Dive Details <span className="text-xs text-muted-foreground font-normal normal-case">(Optional Case Study)</span>
                                </h3>
                            </div>
                        }
                    >
                         <div className="p-6 pt-0 grid grid-cols-1 gap-6">
                            {((['problem', 'challenges', 'solution', 'architecture', 'outcome'] as const)).map((field) => (
                                <div key={field} className="space-y-2">
                                    <CommonLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold ml-1">{field}</CommonLabel>
                                    <CommonTextarea 
                                        className="min-h-[100px] text-sm leading-relaxed" 
                                        value={data[field] || ""} 
                                        onChange={e => setData({...data, [field]: e.target.value})} 
                                        placeholder={`Describe the ${field}...`}
                                    />
                                </div>
                             ))}
                        </div>
                    </CommonAccordionItem>
                </section>

                {/* SECTION 4: Meta */}
                <section className="bg-background border border-border rounded-xl p-6 flex flex-wrap gap-8 items-center justify-between shadow-sm">
                     <label className="flex items-center gap-3 cursor-pointer group select-none">
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
                        <CommonLabel className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</CommonLabel>
                        <CommonSelect 
                            className="w-[140px]"
                            value={data.status || "Completed"}
                            onChange={e => setData({...data, status: e.target.value as "Completed" | "In Progress" | "Building"})}
                        >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Building">Building</option>
                        </CommonSelect>
                    </div>

                    <div className="flex items-center gap-3">
                        <CommonLabel className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Order</CommonLabel>
                        <CommonInput 
                            type="number" 
                            className="w-20 font-mono text-center" 
                            value={data.order || 0} 
                            onChange={e => setData({...data, order: parseInt(e.target.value)})} 
                        />
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/40 bg-secondary/5 flex justify-end gap-4 rounded-b-xl">
                <CommonButton type="button" variant="ghost" onClick={onCancel}>Cancel</CommonButton>
                <CommonButton type="submit" className="shadow-lg shadow-primary/20">Save Project</CommonButton>
            </div>
        </form>
    );
}
