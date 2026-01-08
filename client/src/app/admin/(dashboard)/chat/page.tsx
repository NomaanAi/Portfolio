"use client";

import { useState } from "react";
import ChatLogs from "@/components/admin/ChatLogs";
import KnowledgeManager from "@/components/admin/KnowledgeManager";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'knowledge'>('logs');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Assistant Management</h1>
      
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button 
            onClick={() => setActiveTab('logs')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'logs' ? 'text-accent-cyan' : 'text-white/50 hover:text-white'
            }`}
        >
            Chat History
            {activeTab === 'logs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />}
        </button>
        <button 
            onClick={() => setActiveTab('knowledge')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'knowledge' ? 'text-accent-cyan' : 'text-white/50 hover:text-white'
            }`}
        >
            Knowledge Base
            {activeTab === 'knowledge' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />}
        </button>
      </div>

      {activeTab === 'logs' ? <ChatLogs /> : <KnowledgeManager />}
    </div>
  );
}
