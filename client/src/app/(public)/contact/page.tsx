"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Send, Mail, MapPin, ArrowRight, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonTextarea } from "@/components/common/CommonTextArea";
import { CommonLabel } from "@/components/common/CommonLabel";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "", 
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    try {
      await api.post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 container-wide flex items-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 w-full">
            
            {/* Left Content */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-10"
            >
                <div>
                   <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter mb-4 leading-tight">
                       Let's Build <br />
                       <span className="text-foreground">Something Intelligent.</span>
                   </h1>
                   <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
                       Open for collaborations, freelance projects, or just a deep dive conversation about the future of AI and Web.
                   </p>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-6 group cursor-default">
                        <div className="p-4 rounded-2xl border border-border bg-background group-hover:border-primary/50 transition-colors duration-300">
                            <Mail className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Email Me</h3>
                            <p className="text-muted-foreground group-hover:text-primary transition-colors">nomanshaikh0998@gmail.com</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-6 group cursor-default">
                        <div className="p-4 rounded-2xl border border-border bg-background group-hover:border-primary/50 transition-colors duration-300">
                            <MapPin className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Location</h3>
                            <p className="text-muted-foreground group-hover:text-primary transition-colors">Remote / Global</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <h3 className="font-bold text-lg">Connect</h3>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com/NomaanAi" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl border border-border bg-background hover:border-primary/50 hover:text-primary transition-all duration-300 group">
                                <Github className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                            </a>
                            <a href="https://www.linkedin.com/in/nomaanai/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl border border-border bg-background hover:border-primary/50 hover:text-primary transition-all duration-300 group">
                                <Linkedin className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Form */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-background border border-border rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <CommonLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</CommonLabel>
                            <CommonInput 
                                required 
                                className="bg-secondary/20 border-border focus:ring-primary/50 focus:border-primary" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <CommonLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</CommonLabel>
                            <CommonInput 
                                required 
                                type="email"
                                className="bg-secondary/20 border-border focus:ring-primary/50 focus:border-primary" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                placeholder="nomanshaikh0998@gmail.com"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <CommonLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</CommonLabel>
                         <CommonInput 
                            required 
                            className="bg-secondary/20 border-border focus:ring-primary/50 focus:border-primary" 
                            value={formData.subject} 
                            onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                            placeholder="Project Inquiry"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <CommonLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</CommonLabel>
                        <CommonTextarea 
                            required 
                            className="bg-secondary/20 border-border focus:ring-primary/50 focus:border-primary min-h-[150px] resize-none" 
                            value={formData.message} 
                            onChange={(e) => setFormData({...formData, message: e.target.value})} 
                            placeholder="Tell me about your project..."
                        />
                    </div>

                    <CommonButton 
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold bg-foreground text-background hover:opacity-90"
                    >
                        {loading ? "Sending..." : <>Send Message <ArrowRight className="w-5 h-5 ml-2" /></>}
                    </CommonButton>

                    {status === "success" && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-center text-sm font-medium">
                            Message sent successfully!
                        </div>
                    )}
                    {status === "error" && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center text-sm font-medium">
                            Failed to send message. Please try again.
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    </main>
  );
}
