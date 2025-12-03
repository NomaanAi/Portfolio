import React, { useEffect, useState } from 'react';
import { getHomepage, updateHomepage } from '../../services/api';

export default function HomepageAdmin() {
  const [form, setForm] = useState({ heroTitle: '', heroSubtitle: '', aboutText: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    getHomepage().then(res => setForm(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateHomepage(form);
      setStatus('saved');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-dark mb-6">Homepage Content</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Title</label>
            <input 
              value={form.heroTitle || ''} 
              onChange={e => setForm({...form, heroTitle: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Subtitle</label>
            <input 
              value={form.heroSubtitle || ''} 
              onChange={e => setForm({...form, heroSubtitle: e.target.value})} 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">About Text</label>
            <textarea 
              rows="6"
              value={form.aboutText || ''} 
              onChange={e => setForm({...form, aboutText: e.target.value})} 
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
