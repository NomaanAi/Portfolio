"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Save, Eye, Plus, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [principles, setPrinciples] = useState<{p: string, d: string}[]>([]);
  
  useEffect(() => {
    const fetchSettings = async () => {
       try {
         const res = await api.get("/settings");
         const settings = res.data.data?.settings || res.data.data || {};
         
         if (settings.about) {
             setContent(settings.about.text || "");
             setPrinciples(settings.about.principles || []);
         }
         if (settings.hero) {
             setHeroTitle(settings.hero.title || "");
             setHeroSubtitle(settings.hero.subtitle || "");
         }
       } catch (error) {
         console.error("Failed to fetch settings", error);
       } finally {
         setLoading(false);
       }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
        await api.patch("/settings", {
            about: { 
                text: content,
                principles: principles 
            },
            hero: { title: heroTitle, subtitle: heroSubtitle }
        });
        alert("Settings saved successfully!");
    } catch (error) {
        console.error("Failed to save", error);
        alert("Failed to save settings");
    }
  };

  const addPrinciple = () => setPrinciples([...principles, { p: "", d: "" }]);
  const updatePrinciple = (index: number, field: 'p'|'d', value: string) => {
      const updated = [...principles];
      updated[index][field] = value;
      setPrinciples(updated);
  };
  const removePrinciple = (index: number) => setPrinciples(principles.filter((_, i) => i !== index));

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading System Configuration...</div>;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div>
            <h1 className="text-3xl font-bold font-heading">Global Configuration</h1>
            <p className="text-muted-foreground mt-1">Manage hero messaging and about content.</p>
        </div>
        <button onClick={handleSave} className="bg-primary text-primary-foreground px-8 py-3 rounded-md flex items-center gap-2 hover:bg-primary/90 transition shadow-lg font-bold">
            <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* EDITORS */}
        <div className="space-y-8">
            {/* Hero Editor */}
            <div className="bg-card border border-border/60 p-8 rounded-xl space-y-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><Eye className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">Hero Section</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Main Title</label>
                        <input 
                            className="w-full bg-background border border-border p-4 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all font-heading font-bold text-lg" 
                            value={heroTitle} 
                            onChange={e => setHeroTitle(e.target.value)}
                            placeholder="e.g. System Architecture & ML Implementation"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subtitle</label>
                        <input 
                            className="w-full bg-background border border-border p-4 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono text-sm" 
                            value={heroSubtitle} 
                            onChange={e => setHeroSubtitle(e.target.value)}
                            placeholder="e.g. Focused on high-availability backend development and data processing pipelines."
                        />
                    </div>
                </div>
            </div>

            {/* About Editor */}
            <div className="bg-card border border-border/60 p-8 rounded-xl space-y-8 shadow-sm">
                 <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Eye className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">About Section</h2>
                </div>
                
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Biography</label>
                    <textarea 
                        className="w-full min-h-[300px] bg-background border border-border p-4 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono text-sm leading-relaxed resize-y" 
                        value={content} 
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your bio here..."
                    />
                </div>

                <div className="space-y-6 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Operating Principles</label>
                        <button onClick={addPrinciple} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add Principle
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {principles.map((pr, i) => (
                            <div key={i} className="p-4 border border-border/50 rounded-lg bg-background/50 relative group">
                                <button 
                                    onClick={() => removePrinciple(i)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-background border border-border rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="space-y-4">
                                    <input 
                                        className="w-full bg-transparent border-b border-border/50 pb-2 focus:border-primary outline-none transition-colors font-bold text-sm"
                                        value={pr.p}
                                        onChange={e => updatePrinciple(i, 'p', e.target.value)}
                                        placeholder="Principle Title (e.g. Reliability Over Novelty)"
                                    />
                                    <textarea 
                                        className="w-full bg-transparent text-xs text-muted-foreground leading-relaxed outline-none min-h-[60px] resize-none"
                                        value={pr.d}
                                        onChange={e => updatePrinciple(i, 'd', e.target.value)}
                                        placeholder="Description (e.g. Prioritizing stable, proven architectures...)"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* PREVIEWS */}
        <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-4">Live Preview</h3>
            
            {/* Hero Preview */}
            <div className="relative group perspective-1000">

                <div className="relative bg-black rounded-xl border border-white/10 overflow-hidden aspect-video flex items-center justify-center p-8 shadow-2xl">
                     {/* Fake Background */}
                     <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                     </div>
                     
                     <div className="text-center space-y-4 max-w-lg z-10">
                        <h1 className="text-4xl font-black font-heading text-white tracking-tight leading-none">
                            {heroTitle || "Title Preview"}
                        </h1>
                        <p className="text-lg text-gray-400 font-light tracking-wide">
                            {heroSubtitle || "Subtitle Preview"}
                        </p>
                        <div className="flex justify-center gap-4 pt-4 opacity-70 scale-90">
                             <div className="h-10 px-6 rounded-full bg-white text-black font-bold flex items-center text-xs">View Work</div>
                             <div className="h-10 px-6 rounded-full border border-white/20 text-white font-bold flex items-center text-xs">Contact</div>
                        </div>
                     </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2 font-mono">Hero Component (Scaled)</p>
            </div>

            {/* About Preview */}
            <div className="relative">
                <div className="bg-background border border-border rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-muted-foreground mb-6">About Me</h3>
                    <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-loose whitespace-pre-wrap">
                        {content || "Your bio will appear here..."}
                    </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2 font-mono">Typography Check (Inter + Mono)</p>
            </div>
        </div>
      </div>
    </div>
  );
}
