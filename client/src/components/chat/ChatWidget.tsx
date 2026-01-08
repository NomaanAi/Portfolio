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
      <div className="fixed bottom-6 right-6 z-[100] md:bottom-10 md:right-10">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-[90vw] md:w-96 h-[500px] bg-background border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            >
              {/* Header */}
              <div className="p-4 bg-accent-primary/10 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Portfolio Assistant</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${user ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">
                        {user ? 'Online' : 'Restricting Access'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {!user ? (
                // Login Gate
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-black/40 overflow-y-auto scrollbar-hide">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center relative ring-1 ring-white/10">
                            <Lock className="w-6 h-6 text-white/70" />
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-primary"></span>
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white tracking-tight">Access Restricted</h3>
                            <p className="text-xs text-white/50 max-w-[240px] leading-relaxed mx-auto">
                                Please verify your identity to access the assistant.
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-[300px] space-y-3">
                        {/* Primary Action */}
                        <GoogleLoginBtn />

                        {/* Hidden Email Toggle */}
                        {!showEmailForm && (
                            <button 
                                onClick={() => setShowEmailForm(true)}
                                className="w-full py-2 text-xs text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                Use email instead
                            </button>
                        )}

                        {/* Secondary Form */}
                        <AnimatePresence>
                            {showEmailForm && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative flex items-center justify-center mb-4 mt-2">
                                         <div className="border-t border-white/10 w-full absolute"></div>
                                         <span className="bg-[#0a0a0a] px-2 text-[10px] text-white/30 uppercase tracking-widest relative z-10">OR</span>
                                    </div>

                                    <form onSubmit={handleLogin} className="w-full space-y-3">
                                        {loginError && (
                                            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] text-red-200 font-mono">
                                                {loginError}
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <input 
                                                type="email" 
                                                placeholder="Email Address" 
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent-primary/50 focus:bg-white/10 transition-all"
                                            />
                                            <input 
                                                type="password" 
                                                placeholder="Password" 
                                                required
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent-primary/50 focus:bg-white/10 transition-all"
                                            />
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={loginLoading}
                                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-white/5"
                                        >
                                            {loginLoading ? 'Verifying...' : 'Sign In'}
                                        </button>
                                    </form>
                                     <div className="text-center mt-3 pb-2">
                                        <button onClick={() => { setOpen(false); router.push('/login'); }} className="text-[10px] text-white/40 hover:text-accent-primary transition-colors">
                                            Don't have an account? Register
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
              ) : (
                // Chat Interface
                <>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === 'user' ? 'bg-white/10' : 'bg-accent-primary/20'
                        }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-accent-primary" />}
                        </div>
                        <div className={`rounded-2xl p-3 text-sm max-w-[80%] ${
                          msg.role === 'user' 
                            ? 'bg-white text-black rounded-tr-none' 
                            : 'bg-white/5 text-text-secondary border border-white/5 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    
                    {loading && (
                       <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                           <Bot className="w-4 h-4 text-accent-primary" />
                         </div>
                         <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1">
                            <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-200" />
                         </div>
                       </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about my skills..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent-primary/50 transition-colors"
                      />
                      <button 
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-accent-primary text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="w-14 h-14 bg-foreground text-background rounded-full shadow-lg shadow-foreground/20 flex items-center justify-center transition-colors hover:bg-foreground/90 z-50 relative"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          
          {/* Pulse effect if closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full border border-foreground/30 animate-ping opacity-20 pointer-events-none"></span>
          )}
        </motion.button>
      </div>
    </>
  );
}
