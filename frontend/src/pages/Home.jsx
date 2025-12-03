import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getSkills } from '../services/api';

export default function Home() {
  const [home, setHome] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // Fetch Homepage content
    api.get('/homepage').then(r => setHome(r.data)).catch(console.error);
    // Fetch Skills
    getSkills().then(r => setSkills(r.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-dark tracking-tight mb-6">
          {home?.heroTitle || 'Building Digital Experiences'}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          {home?.heroSubtitle || 'Full Stack Developer specializing in modern web technologies.'}
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/projects" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-600 transition shadow-lg shadow-indigo-200">
            View Work
          </Link>
          <Link to="/contact" className="bg-white text-dark border border-slate-200 px-8 py-3 rounded-full font-medium hover:bg-slate-50 transition">
            Contact Me
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-dark mb-4">About Me</h2>
        <p className="text-slate-600 leading-relaxed">
          {home?.aboutText || 'I am a passionate developer...'}
        </p>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-2xl font-bold text-dark mb-6">Technical Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map(skill => (
            <div key={skill._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 hover:shadow-md transition">
              <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-primary font-bold">
                {skill.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-dark">{skill.name}</h3>
                <p className="text-xs text-slate-500">{skill.level}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
