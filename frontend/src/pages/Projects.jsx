import React, { useEffect, useState } from 'react';
import { getProjects, trackEvent } from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(r => setProjects(r.data)).catch(console.error);
  }, []);

  const handleView = (id) => {
    trackEvent('project_view', { projectId: id });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(p => (
          <div key={p._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition group">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {p.link ? (
                <a href={p.link} target="_blank" rel="noreferrer" onClick={() => handleView(p._id)}>
                   {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </a>
              ) : (
                 p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-dark mb-2">{p.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">{p.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {p.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-indigo-50 text-primary text-xs rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {p.link && (
                  <a 
                    href={p.link} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => handleView(p._id)}
                    className="flex-1 text-center bg-dark text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                  >
                    View Project
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
