"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Send, Mail, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { CommonCard, CommonCardContent, CommonCardHeader, CommonCardTitle } from "@/components/common/CommonCard";

export default function InquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry", 
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    
    // Minimum validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        setStatus("error");
        setLoading(false);
        return;
    }

    try {
      await api.post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 px-6 container-max">
        <div className="max-w-4xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24">
                
                {/* Left: Context */}
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter">Contact</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed font-light">
                            For project inquiries and technical consulting.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 p-4 border border-border bg-card/50 rounded-xl w-full items-center">
                                <Mail className="w-5 h-5 text-primary" />
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</p>
                                    <p className="text-sm font-bold text-foreground">nomanshaikh0998@gmail.com</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <a href="https://github.com/NomaanAi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border bg-card/50 rounded-xl hover:bg-secondary/50 transition-colors group">
                                    <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-bold text-foreground">GitHub</span>
                                </a>
                                <a href="https://linkedin.com/in/noman-shaikh-ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border bg-card/50 rounded-xl hover:bg-secondary/50 transition-colors group">
                                    <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-bold text-foreground">LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Submission Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <CommonCard className="bg-background/50 backdrop-blur-sm">
                        <CommonCardHeader>
                            <CommonCardTitle className="text-xl">Send a Message</CommonCardTitle>
                        </CommonCardHeader>
                        <CommonCardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                                        <input 
                                            required 
                                            className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                                        <input 
                                            required 
                                            type="email"
                                            className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm" 
                                            value={formData.email} 
                                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inquiry Type</label>
                                         <div className="relative">
                                            <select 
                                                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-sm appearance-none cursor-pointer"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            >
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Project Proposal">Project Proposal</option>
                                                <option value="Technical Consulting">Technical Consulting</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                         </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</label>
                                        <textarea 
                                            required 
                                            className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[140px] resize-none text-sm leading-relaxed" 
                                            value={formData.message} 
                                            onChange={(e) => setFormData({...formData, message: e.target.value})} 
                                            placeholder="How can I help you?"
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Sending...</span>
                                    ) : (
                                        <>Send Message <Send className="w-4 h-4" /></>
                                    )}
                                </button>

                                {status === "success" && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-lg text-sm flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Message sent. I will respond shortly.
                                    </div>
                                )}
                                {status === "error" && (
                                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-destructive" />
                                        Failed to send message. Please try again.
                                    </div>
                                )}
                            </form>
                        </CommonCardContent>
                    </CommonCard>
                </motion.div>
            </div>
        </div>
    </main>
  );
}
