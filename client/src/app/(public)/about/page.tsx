"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";


export default function AboutPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
        try {
            const res = await api.get("/settings");
            const settings = res.data.data?.settings || res.data.data || {};
            if (settings.about) setContent(settings.about.text || "");
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    fetchContent();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 container-wide relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Sidebar / Mission - Takes up 4 columns on large screens */}
            <div className="lg:col-span-4 space-y-8">
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="sticky top-32"
                 >
                     <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter mb-8 leading-tight">
                         About <br/> <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary-foreground">My Mission</span>
                     </h1>
                     
                     <div className="p-8 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl relative">
                         <p className="relative z-10 text-lg font-medium leading-relaxed text-muted-foreground">
                             To engineer systems that bridge the gap between complex artificial intelligence models and intuitive, human-centric experiences.
                         </p>
                     </div>
                 </motion.div>
            </div>

            {/* Main Content - Takes up 8 columns */}
            <div className="lg:col-span-8">
                {loading ? (
                    <div className="h-96 flex items-center justify-center text-muted-foreground">Loading biography...</div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="prose prose-lg prose-invert max-w-none"
                    >
                        <div className="font-sans leading-loose text-muted-foreground/90 whitespace-pre-wrap text-lg">
                            {content || "No content available."}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    </main>
  );
}
