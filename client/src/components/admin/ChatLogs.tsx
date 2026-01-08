"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { RefreshCw, Database, MessageSquare } from "lucide-react";

interface ChatLog {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  contextUsed?: string[];
  userId?: string;
}

export default function ChatLogs() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/chat/history");
      setLogs(data.data.logs);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    if (!confirm("This will overwrite the current Knowledge Base with the system prompt file. Continue?")) return;
    
    setIngesting(true);
    setIngestResult(null);
    try {
      const { data } = await api.post("/chat/ingest");
      setIngestResult(data.data);
      alert(`Ingestion Successful! Processed ${data.data.count} chunks.`);
    } catch (error: any) {
      console.error("Ingestion failed", error);
      alert("Ingestion Failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIngesting(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent-cyan" />
            Chat History
        </h2>
        <div className="flex gap-3">
            <button 
                onClick={fetchLogs} 
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh Logs"
            >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={handleIngest} 
                disabled={ingesting}
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50 rounded-lg transition-colors disabled:opacity-50"
            >
                <Database className="w-4 h-4" />
                {ingesting ? 'Updating KB...' : 'Update Knowledge Base'}
            </button>
        </div>
      </div>

      <div className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/50 uppercase text-xs">
                    <tr>
                        <th className="p-4 font-medium">Time</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Message</th>
                        <th className="p-4 font-medium">Context IDs</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                        <tr key={log._id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white/40 whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                                    log.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {log.role}
                                </span>
                            </td>
                            <td className="p-4 max-w-md truncate" title={log.content}>
                                {log.content}
                            </td>
                            <td className="p-4 text-xs text-white/40">
                                {log.contextUsed?.join(', ') || '-'}
                            </td>
                        </tr>
                    ))}
                    {!loading && logs.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-white/30">
                                No chat history found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
