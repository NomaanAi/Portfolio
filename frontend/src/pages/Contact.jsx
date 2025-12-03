import React, { useState } from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const submit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await api.post('/contacts', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-dark mb-4">Get in Touch</h1>
        <p className="text-slate-600">Have a project in mind? Let's work together.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input 
                type="email"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea 
              rows="5"
              value={form.message} 
              onChange={e => setForm({...form, message: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              required 
            />
          </div>

          <button 
            disabled={status === 'submitting'}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <div className="p-4 bg-green-50 text-green-600 rounded-lg text-center">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
              Something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
