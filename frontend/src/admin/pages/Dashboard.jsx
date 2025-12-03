import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalViews: 0, projectViews: 0, recent: [] });

  useEffect(() => {
    getAnalytics().then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-dark mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-secondary text-sm font-medium uppercase">Total API Requests</h3>
          <p className="text-4xl font-bold text-primary mt-2">{stats.totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-secondary text-sm font-medium uppercase">Project Views</h3>
          <p className="text-4xl font-bold text-primary mt-2">{stats.projectViews}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-dark mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-secondary text-sm">
                <th className="py-3">Event</th>
                <th className="py-3">Path</th>
                <th className="py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map(item => (
                <tr key={item._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 text-dark font-medium">{item.event}</td>
                  <td className="py-3 text-secondary text-sm">{item.meta?.path || '-'}</td>
                  <td className="py-3 text-secondary text-sm">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
