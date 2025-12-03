import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', desc: '', image: '', link: '', tags: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => getProjects().then(res => setProjects(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()) };
    if (editingId) {
      await updateProject(editingId, data);
    } else {
      await createProject(data);
    }
    setForm({ title: '', desc: '', image: '', link: '', tags: '' });
    setEditingId(null);
    loadProjects();
  };

  const handleEdit = (p) => {
    setForm({ ...p, tags: p.tags.join(', ') });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await deleteProject(id);
      loadProjects();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-dark mb-6">Manage Projects</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input className="p-3 border rounded-lg" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea className="p-3 border rounded-lg" placeholder="Description" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} required />
          <input className="p-3 border rounded-lg" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
          <input className="p-3 border rounded-lg" placeholder="Project Link" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
          <input className="p-3 border rounded-lg" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', desc: '', image: '', link: '', tags: '' }); }} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            {p.image && <img src={p.image} alt={p.title} className="h-40 w-full object-cover rounded-lg mb-4" />}
            <h3 className="text-lg font-bold text-dark">{p.title}</h3>
            <p className="text-secondary text-sm mb-4 flex-grow">{p.desc}</p>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => handleEdit(p)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
