"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { MessageSquare, Settings, Database, Trash2, RefreshCcw, Save } from "lucide-react";

export default function ChatbotAdminPage() {
  const [activeTab, setActiveTab] = useState<"logs" | "knowledge" | "settings">("logs");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "logs") {
        const res = await api.get("/chat/history");
        setLogs(res.data.data.logs);
      }
      // Add other tabs fetch logic here
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <h1 className="text-3xl font-bold font-heading">Chatbot Administration</h1>
        <div className="flex gap-2 bg-secondary/50 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab("logs")}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "logs" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
           >
             <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Chat Logs</div>
           </button>
           <button 
             onClick={() => setActiveTab("knowledge")}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "knowledge" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
           >
             <div className="flex items-center gap-2"><Database className="w-4 h-4"/> Knowledge Base</div>
           </button>
           <button 
             onClick={() => setActiveTab("settings")}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
           >
             <div className="flex items-center gap-2"><Settings className="w-4 h-4"/> Settings</div>
           </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden min-h-[500px]">
        {loading ? (
           <div className="flex items-center justify-center h-64">
              <RefreshCcw className="w-6 h-6 animate-spin text-muted-foreground" />
           </div>
        ) : (
          <>
            {activeTab === "logs" && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-muted-foreground uppercase text-xs font-mono">
                            <tr>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Response</th>
                                <th className="px-6 py-4">Tokens</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {logs.map((log: any) => (
                                <tr key={log._id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-muted-foreground">
                                        {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user ? (
                                            <div>
                                                <div className="font-semibold">{log.user.name}</div>
                                                <div className="text-xs text-muted-foreground">{log.user.email}</div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">Anonymous</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={log.message}>
                                        {log.message}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground" title={log.response}>
                                        {log.response}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {log.tokensUsed || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">No logs found.</div>
                    )}
                </div>
            )}

            {activeTab === "knowledge" && (
                <div className="p-8 text-center text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-2">Knowledge Base Management</h3>
                    <p className="max-w-md mx-auto">This module allows you to add custom Q&A pairs/documents to the RAG system.</p>
                    <div className="mt-6 p-4 border border-dashed border-border rounded-lg max-w-lg mx-auto bg-secondary/5">
                        Feature coming soon in next sprint.
                    </div>
                </div>
            )}
            
            {activeTab === "settings" && (
                 <div className="p-8 text-center text-muted-foreground">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-2">Bot Settings</h3>
                    <p className="max-w-md mx-auto">Configure model parameters, temperature, and system prompts.</p>
                     <div className="mt-6 p-4 border border-dashed border-border rounded-lg max-w-lg mx-auto bg-secondary/5">
                        Feature coming soon in next sprint.
                    </div>
                 </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
