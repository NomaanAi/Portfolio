"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Trash2, Edit2, Check, X, Move } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  category: string;
  order: number;
}

const CATEGORIES = ["Frontend", "Backend", "Languages", "Tools", "Design", "DevOps", "AI/ML", "Soft Skills", "Other"];

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
    setFormData({ category: "Other", order: 0 }); // Defaults
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({});
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Skills Manager</h1>
        <button 
           onClick={handleCreate}
           className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition"
        >
            <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {isCreating && (
         <div className="border border-border p-4 rounded-lg bg-muted/30 mb-6">
            <h3 className="font-semibold mb-3">Add New Skill</h3>
            <SkillForm 
                data={formData} 
                onChange={(d) => setFormData({...formData, ...d})} 
                onSave={handleSave} 
                onCancel={handleCancel} 
            />
         </div>
      )}

      <div className="grid gap-4">
        {skills.map((skill) => (
          <div key={skill._id} className="bg-card border border-border/50 p-4 rounded-lg flex items-center justify-between group hover:border-border transition-colors">
             {isEditing === skill._id ? (
                 <SkillForm 
                    data={formData} 
                    onChange={(d) => setFormData({...formData, ...d})} 
                    onSave={handleSave} 
                    onCancel={handleCancel} 
                 />
             ) : (
                 <>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono opacity-50">
                            {skill.order}
                        </div>
                        <div>
                            <h3 className="font-bold">{skill.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {skill.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(skill)} className="p-2 hover:bg-secondary rounded-md text-blue-400">
                             <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(skill._id)} className="p-2 hover:bg-secondary rounded-md text-red-400">
                             <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                 </>
             )}
          </div>
        ))}

        {skills.length === 0 && !isCreating && (
          <div className="text-center py-10 text-muted-foreground">
            No skills found. Add one to get started.
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
        <div className="flex flex-wrap gap-4 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-xs mb-1 text-muted-foreground font-medium uppercase tracking-wider">Name</label>
                <input 
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
                    value={data.name || ""}
                    onChange={e => onChange({ name: e.target.value })}
                    placeholder="e.g. React"
                />
            </div>
            <div className="w-[150px]">
                <label className="block text-xs mb-1 opacity-70">Category</label>
                <select 
                    className="w-full bg-background text-foreground border border-border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    value={data.category || CATEGORIES[0]}
                    onChange={e => onChange({ category: e.target.value })}
                >
                    {CATEGORIES.map(c => (
                        <option key={c} value={c} className="bg-background text-foreground hover:bg-secondary">
                            {c}
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-[80px]">
                <label className="block text-xs mb-1 opacity-70">Order</label>
                <input 
                    type="number"
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
                    value={data.order || 0}
                    onChange={e => onChange({ order: parseInt(e.target.value) })}
                />
            </div>
            <div className="flex gap-2 pb-0.5">
                <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded">
                    <Check className="w-4 h-4" />
                </button>
                <button onClick={onCancel} className="bg-secondary hover:bg-secondary/80 text-foreground p-2 rounded">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
