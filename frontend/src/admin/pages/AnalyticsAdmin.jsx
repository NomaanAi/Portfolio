import React, { useEffect, useState } from 'react';
import { getAnalyticsEvents } from '../../services/api';

export default function AnalyticsAdmin() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAnalyticsEvents().then(res => setEvents(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Analytics Log</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Event Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Metadata</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map(e => (
              <tr key={e._id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-dark">{e.event}</td>
                <td className="p-4 text-slate-600 font-mono text-xs">
                  {JSON.stringify(e.meta)}
                </td>
                <td className="p-4 text-slate-500 text-sm">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-slate-500">No analytics data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
