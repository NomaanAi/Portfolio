import React, { useEffect, useState } from 'react';
import { getContacts, markContactRead, deleteContact } from '../../services/api';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => getContacts().then(res => setContacts(res.data));

  const handleMarkRead = async (id) => {
    await markContactRead(id);
    loadContacts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      await deleteContact(id);
      loadContacts();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">Messages</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Message</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map(c => (
              <tr key={c._id} className={c.isRead ? 'bg-white' : 'bg-blue-50/50'}>
                <td className="p-4 font-medium text-dark">{c.name}</td>
                <td className="p-4 text-slate-600">{c.email}</td>
                <td className="p-4 text-slate-600 max-w-xs truncate">{c.message}</td>
                <td className="p-4 text-slate-500 text-sm">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-4 flex gap-2">
                  {!c.isRead && (
                    <button onClick={() => handleMarkRead(c._id)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                      Mark Read
                    </button>
                  )}
                  <button onClick={() => handleDelete(c._id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
