"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Trash2, Edit2, Check, X, Move } from "lucide-react";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonLabel } from "@/components/common/CommonLabel";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonCard } from "@/components/common/CommonCard";

interface Skill {
  _id: string;
  name: string;
  category: string;
  description: string;
  defendedBy: string;
  order: number;
}

const CATEGORIES = [
  "Machine Learning & Data Reasoning", 
  "Systems / Backend Thinking", 
  "Engineering Judgment", 
  "Languages", 
  "Tools", 
  "Other"
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of skill being edited
  const [formData, setFormData] = useState<Partial<Skill>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Skills
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await api.get("/skills");
      // Assuming response format
      setSkills(res.data.data.data || res.data.data || []);
    } catch (error) {
      console.error("Error fetching skills", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Handlers
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete skill");
    }
  };

  const handleEdit = (skill: Skill) => {
    setIsEditing(skill._id);
    setFormData(skill);
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const res = await api.post("/skills", formData);
        setSkills([...skills, res.data.data.data || res.data.data]);
        setIsCreating(false);
      } else if (isEditing) {
        const res = await api.patch(`/skills/${isEditing}`, formData);
        setSkills(skills.map(s => s._id === isEditing ? (res.data.data.data || res.data.data) : s));
        setIsEditing(null);
      }
      setFormData({});
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to save skill");
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(null);
    setFormData({ category: CATEGORIES[0], order: 0 }); // Defaults
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({});
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-card border border-border/50 p-6 rounded-xl">
        <div>
            <h1 className="text-2xl font-bold font-heading">Capability Manager</h1>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-mono">Archive Integrity Maintenance</p>
        </div>
        <CommonButton 
           onClick={handleCreate}
           className="gap-2"
        >
            <Plus className="w-4 h-4" /> Add Capability
        </CommonButton>
      </div>

      {isCreating && (
         <div className="border border-primary/20 p-8 rounded-xl bg-primary/5 mb-8 shadow-inner">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-primary">New Capability Entry</h3>
            <SkillForm 
                data={formData} 
                onChange={(d) => setFormData({...formData, ...d})} 
                onSave={handleSave} 
                onCancel={handleCancel} 
            />
         </div>
      )}

      <div className="grid gap-6">
        {skills.map((skill) => (
          <div key={skill._id} className="bg-card border border-border/40 p-6 rounded-xl group hover:border-primary/30 transition-all hover:shadow-lg">
             {isEditing === skill._id ? (
                 <SkillForm 
                    data={formData} 
                    onChange={(d) => setFormData({...formData, ...d})} 
                    onSave={handleSave} 
                    onCancel={handleCancel} 
                 />
             ) : (
                 <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-1">[{skill.category}]</span>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{skill.name}</h3>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CommonButton variant="ghost" size="icon" onClick={() => handleEdit(skill)} className="text-blue-400 hover:bg-blue-400/10">
                                 <Edit2 className="w-4 h-4" />
                            </CommonButton>
                            <CommonButton variant="ghost" size="icon" onClick={() => handleDelete(skill._id)} className="text-red-400 hover:bg-red-400/10">
                                 <Trash2 className="w-4 h-4" />
                            </CommonButton>
                        </div>
                    </div>
                    {skill.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl italic">&quot;{skill.description}&quot;</p>
                    )}
                    <div className="flex items-center justify-between border-t border-border/40 pt-4">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-primary" />
                             Defended by: <span className="text-foreground font-bold">{skill.defendedBy || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground opacity-30">ORD_{skill.order}</div>
                    </div>
                 </div>
             )}
          </div>
        ))}

        {skills.length === 0 && !isCreating && (
          <div className="text-center py-20 bg-secondary/10 rounded-xl border border-dashed border-border text-muted-foreground font-mono text-sm uppercase tracking-widest">
            Log is empty. Initialize capability entries.
          </div>
        )}
      </div>
    </div>
  );
}

function SkillForm({ data, onChange, onSave, onCancel }: { 
    data: Partial<Skill>, 
    onChange: (d: Partial<Skill>) => void,
    onSave: () => void,
    onCancel: () => void 
}) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <CommonLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Entry Label (Name)</CommonLabel>
                    <CommonInput 
                        value={data.name || ""}
                        onChange={e => onChange({ name: e.target.value })}
                        placeholder="e.g. Model Evaluation Strategy"
                        className="font-bold text-lg"
                    />
                </div>
                <div className="space-y-2">
                    <CommonLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">System Category</CommonLabel>
                    <CommonSelect 
                        value={data.category || CATEGORIES[0]}
                        onChange={e => onChange({ category: e.target.value })}
                        className="font-mono text-xs font-bold"
                    >
                        {CATEGORIES.map(c => (
                            <option key={c} value={c} className="bg-background text-foreground uppercase">
                                {c}
                            </option>
                        ))}
                    </CommonSelect>
                </div>
            </div>

            <div className="space-y-2">
                <CommonLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Capability Definition (Description)</CommonLabel>
                <textarea 
                    className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm leading-relaxed min-h-[100px]"
                    value={data.description || ""}
                    onChange={e => onChange({ description: e.target.value })}
                    placeholder="Describe how this capability is applied in engineering contexts..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] gap-8">
                 <div className="space-y-2">
                    <CommonLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Verification Key (Defended By)</CommonLabel>
                    <CommonInput 
                        value={data.defendedBy || ""}
                        onChange={e => onChange({ defendedBy: e.target.value })}
                        placeholder="e.g. System Documentation Archive Entry #4"
                        className="font-mono text-xs uppercase"
                    />
                </div>
                <div className="space-y-2">
                    <CommonLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Logic Order</CommonLabel>
                    <CommonInput 
                        type="number"
                        value={data.order || 0}
                        onChange={e => onChange({ order: parseInt(e.target.value) })}
                        className="text-center font-bold"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border/50">
                <CommonButton onClick={onSave} className="flex-1 font-bold h-12">
                    <Check className="w-5 h-5 mr-2" /> Commit Entry
                </CommonButton>
                <CommonButton onClick={onCancel} variant="secondary" className="px-8 font-bold h-12">
                    <X className="w-5 h-5 mr-2" /> Abort
                </CommonButton>
            </div>
        </div>
    )
}
