import React, { useEffect, useState } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/api';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', level: '', icon: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = () => getSkills().then(res => setSkills(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateSkill(editingId, form);
    } else {
      await createSkill(form);
    }
    setForm({ name: '', level: '', icon: '' });
    setEditingId(null);
    loadSkills();
  };

  const handleEdit = (s) => {
    setForm(s);
    setEditingId(s._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      await deleteSkill(id);
      loadSkills();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-dark mb-6">Manage Skills</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Skill' : 'Add New Skill'}</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <input className="w-full p-3 border rounded-lg" placeholder="Skill Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="flex-1">
            <input className="w-full p-3 border rounded-lg" placeholder="Level (e.g. Advanced)" value={form.level} onChange={e => setForm({...form, level: e.target.value})} />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 transition">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', level: '', icon: '' }); }} className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg">Cancel</button>}
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map(s => (
          <div key={s._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-dark">{s.name}</h3>
              <p className="text-sm text-secondary">{s.level}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline text-sm">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
