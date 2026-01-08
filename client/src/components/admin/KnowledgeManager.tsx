"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Plus, Edit, Trash, Save, X, Search } from "lucide-react";

interface KnowledgeChunk {
  _id: string;
  title: string;
  content: string;
  category: string;
}

export default function KnowledgeManager() {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Edit/Create State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", category: "other" });
  const [saving, setSaving] = useState(false);

  const fetchChunks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/chat/knowledge");
      setChunks(data.data.chunks);
    } catch (error) {
      console.error("Failed to fetch knowledge", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChunks();
  }, []);

  const handleEdit = (chunk: KnowledgeChunk) => {
    setEditingId(chunk._id);
    setFormData({ title: chunk.title, content: chunk.content, category: chunk.category });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ title: "", content: "", category: "other" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return alert("Title and Content are required");
    
    setSaving(true);
    try {
      if (editingId) {
        // Update
        await api.put(`/chat/knowledge/${editingId}`, formData);
      } else {
        // Create
        await api.post("/chat/knowledge", formData);
      }
      setModalOpen(false);
      fetchChunks();
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save chunk");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chunk?")) return;
    try {
      await api.delete(`/chat/knowledge/${id}`);
      fetchChunks();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredChunks = chunks.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
            Knowledge Base
            <span className="text-xs font-normal text-white/50 bg-white/10 px-2 py-0.5 rounded-full">{chunks.length}</span>
        </h2>
        <button 
            onClick={handleCreate} 
            className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-black font-bold rounded-lg hover:bg-white transition-colors"
        >
            <Plus className="w-4 h-4" />
            Add Chunk
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
        <input 
            type="text" 
            placeholder="Search knowledge..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChunks.map((chunk) => (
            <div key={chunk._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${getCategoryColor(chunk.category)}`}>
                        {chunk.category}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(chunk)} className="p-1.5 hover:bg-white/10 rounded">
                            <Edit className="w-3.5 h-3.5 text-white/70" />
                        </button>
                        <button onClick={() => handleDelete(chunk._id)} className="p-1.5 hover:bg-red-500/20 rounded">
                            <Trash className="w-3.5 h-3.5 text-red-400" />
                        </button>
                    </div>
                </div>
                <h3 className="font-bold text-lg mb-2 truncate" title={chunk.title}>{chunk.title}</h3>
                <p className="text-sm text-white/60 line-clamp-3 mb-2 font-mono bg-black/20 p-2 rounded">
                    {chunk.content}
                </p>
            </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-background border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{editingId ? 'Edit Chunk' : 'New Knowledge Chunk'}</h3>
                    <button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                
                <div>
                    <label className="block text-xs uppercase text-white/50 mb-1">Title</label>
                    <input 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-accent-cyan/50"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., React Skills"
                    />
                </div>
                
                <div>
                    <label className="block text-xs uppercase text-white/50 mb-1">Category</label>
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-accent-cyan/50"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="other">Other</option>
                        <option value="skills">Skills</option>
                        <option value="projects">Projects</option>
                        <option value="education">Education</option>
                        <option value="identity">Identity</option>
                        <option value="contact">Contact</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs uppercase text-white/50 mb-1">Content</label>
                    <textarea 
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-accent-cyan/50 font-mono text-sm"
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        placeholder="The actual text the bot will use..."
                    />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                    <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-white/5">Cancel</button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="px-4 py-2 bg-accent-cyan text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <span className="animate-spin w-3 h-3 border-2 border-black border-t-transparent rounded-full" />}
                        Save Chunk
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function getCategoryColor(cat: string) {
    switch(cat) {
        case 'skills': return 'bg-blue-500/20 text-blue-400';
        case 'projects': return 'bg-purple-500/20 text-purple-400';
        case 'identity': return 'bg-orange-500/20 text-orange-400';
        default: return 'bg-white/10 text-white/60';
    }
}
