"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Code, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { useChatStore } from "@/store/useChatStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const { isOpen, setOpen, toggle } = useChatStore();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I can help you find information in my project notes. Ask about the goals, constraints, or decisions made for any project listed here." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await api.post("/chat", {
        message: userMsg,
        sessionId
      });

      if (response.data.status === "success") {
        setMessages(prev => [...prev, { role: "assistant", content: response.data.data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "I could not find matching information in the project notes." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "The search failed to load." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] md:bottom-10 md:right-10 flex flex-col items-end gap-4 font-sans text-foreground">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[90vw] md:w-96 h-[550px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-primary/20 flex items-center justify-center bg-primary/5 text-primary">
                    <Code className="w-4 h-4" />
                  </div>
                  <div />
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Interface */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-secondary border-border text-primary'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className={`p-4 text-xs max-w-[85%] leading-relaxed rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'bg-secondary border border-border text-foreground'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded border border-primary/20 bg-secondary flex items-center justify-center animate-pulse">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-secondary border border-border p-4 rounded-2xl flex gap-1 items-center">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-secondary/30">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about a project..."
                    className="w-full bg-background border border-border pl-4 pr-12 py-3 text-xs text-foreground focus:outline-none focus:border-primary transition-all rounded-xl placeholder:text-muted-foreground/30"
                  />
                  <button 
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1.5 p-1.5 text-primary hover:text-foreground transition-colors disabled:opacity-30"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-all z-50 shadow-2xl relative"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
          )}
        </motion.button>
      </div>
    </>
  );
}

