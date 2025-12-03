import React, { useEffect, useState } from 'react';
import { getSocial, updateSocial } from '../../services/api';

export default function SocialAdmin() {
  const [form, setForm] = useState({ github: '', linkedin: '', twitter: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSocial().then(res => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateSocial(form);
      setStatus('saved');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-dark mb-6">Social Links</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">GitHub URL</label>
            <input 
              value={form.github || ''} 
              onChange={e => setForm({...form, github: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
            <input 
              value={form.linkedin || ''} 
              onChange={e => setForm({...form, linkedin: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Twitter URL</label>
            <input 
              value={form.twitter || ''} 
              onChange={e => setForm({...form, twitter: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition">
              {status === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
            {status === 'saved' && <span className="text-green-600 font-medium">Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
