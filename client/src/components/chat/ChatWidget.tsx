"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Lock, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

import { useChatStore } from "@/store/useChatStore";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import GoogleLoginBtn from "../auth/GoogleLoginBtn";

export default function ChatWidget() {
  const { isOpen, setOpen, toggle } = useChatStore();
  const { user, login } = useAuthContext();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Nomaan's AI assistant. Ask me anything about his projects, skills, or experience." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  // Create a minimal session ID for this browser session
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, loginError]); // Trigger scroll on login error too to show it

  const handleToggle = () => {
    toggle();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    try {
      await login({ email, password });
      // On success, user state updates, re-rendering widget as authenticated
      // No need to close, just clear inputs
      setEmail("");
      setPassword("");
    } catch (error: any) {
        console.error("Login failed", error);
        setLoginError(error.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await api.post("/chat/message", {
        message: userMsg,
        sessionId
      });

      if (response.data.status === "success") {
        setMessages(prev => [...prev, { role: "assistant", content: response.data.data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm taking a break. Please try again later." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] md:bottom-10 md:right-10 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[90vw] md:w-96 h-[550px] bg-[#0B0F1A]/90 backdrop-blur-xl border border-surface-border rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative"
            >
              {/* Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
              
              {/* Header */}
              <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/20 flex items-center justify-center relative">
                    <Bot className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold font-heading text-foreground text-sm tracking-wide">Portfolio Assistant</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {user ? 'Authenticated' : 'Guest Access'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!user ? (
                // Login Gate
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center scrollbar-hide">
                    <div className="w-16 h-16 rounded-full bg-surface border border-surface-border flex items-center justify-center mb-6">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    
                    <h3 className="text-lg font-bold font-heading text-foreground mb-2">Authentication Required</h3>
                    <p className="text-xs text-muted-foreground mb-8 max-w-[240px] leading-relaxed">
                        Please sign in to access the interactive AI assistant and explore project details.
                    </p>

                    <div className="w-full space-y-4">
                        <GoogleLoginBtn />

                        {!showEmailForm && (
                           <button 
                                onClick={() => setShowEmailForm(true)}
                                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors font-mono"
                            >
                                [ Use Email Protocol ]
                            </button>
                        )}
                        {/* Remainder of the form logic stays similar but ensure classes use 'accent' */}
                        <AnimatePresence>
                            {showEmailForm && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <form onSubmit={handleLogin} className="space-y-3 pt-2">
                                        {loginError && (
                                            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-200 font-mono">
                                                {loginError}
                                            </div>
                                        )}
                                        <input 
                                            type="email" 
                                            placeholder="USER_EMAIL" 
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-surface border border-surface-border rounded-none px-4 py-3 text-xs font-mono text-white focus:border-accent focus:bg-surface-hover outline-none transition-all placeholder:text-muted-foreground/30 uppercase tracking-wider"
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="PASSPHRASE" 
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-surface border border-surface-border rounded-none px-4 py-3 text-xs font-mono text-white focus:border-accent focus:bg-surface-hover outline-none transition-all placeholder:text-muted-foreground/30 uppercase tracking-wider"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={loginLoading}
                                            className="w-full bg-white text-black font-bold py-3 rounded-none hover:bg-accent hover:text-white transition-colors disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
                                        >
                                            {loginLoading ? 'Authenticating...' : 'Authenticate'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
              ) : (
                // Chat Interface
                <>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
                    {messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-none flex items-center justify-center flex-shrink-0 border ${
                          msg.role === 'user' 
                            ? 'bg-white text-black border-white' 
                            : 'bg-accent/10 border-accent/20 text-accent'
                        }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        
                        <div className={`p-4 text-xs font-mono max-w-[85%] leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-white text-black shadow-lg' 
                            : 'bg-surface border border-surface-border text-foreground/80'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    
                    {loading && (
                       <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-none bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                           <Bot className="w-4 h-4 text-accent" />
                         </div>
                         <div className="bg-surface border border-surface-border p-4 flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                            <span className="w-1.5 h-1.5 bg-accent animate-pulse delay-100" />
                            <span className="w-1.5 h-1.5 bg-accent animate-pulse delay-200" />
                         </div>
                       </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-surface-border bg-surface/30 backdrop-blur-sm">
                    {messages.length < 3 && !loading && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                            {["SYSTEM_STATUS", "PROJECT_ARCHIVE", "SKILL_MATRIX"].map(reply => (
                                <button
                                    key={reply}
                                    onClick={() => setInput(reply)}
                                    className="whitespace-nowrap px-3 py-1.5 border border-surface-border bg-surface text-[10px] font-mono text-muted-foreground hover:text-accent hover:border-accent hover:bg-accent/5 transition-colors"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="relative group">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="ENTER_COMMAND..."
                        className="w-full bg-surface border border-surface-border pl-4 pr-12 py-3.5 text-xs font-mono text-foreground focus:outline-none focus:border-accent focus:bg-surface-hover transition-all placeholder:text-muted-foreground/30 uppercase tracking-wider"
                      />
                      <button 
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 text-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative w-14 h-14 bg-background border border-surface-border text-foreground hover:border-accent hover:text-accent rounded-full flex items-center justify-center transition-all z-50 shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </motion.button>
      </div>
    </>
  );
}
