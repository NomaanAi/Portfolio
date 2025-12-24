"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Code2, Server, Brain, Wrench, Layers, Terminal } from "lucide-react";

// Strict Icon Mapping
const CATEGORY_ICONS: Record<string, any> = {
    "Frontend": Layers,
    "Backend": Server,
    "AI/ML": Brain,
    "DevOps": Wrench,
    "Core": Terminal
};

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills");
        // Filter out 'Other' explicitly
        const allSkills = res.data.data?.data || res.data.data || [];
        const filtered = allSkills.filter((s: any) => s.category !== "Other");
        setSkills(filtered);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Group by category
  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || "Core"; 
    // If category is not in our known list, maybe map it to Core or Backend?
    // For now assuming Admin panel provides options: Frontend, Backend, AI/ML, DevOps.
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Strict Priority Order
  const priority = ["AI/ML", "Backend", "Frontend", "DevOps", "Core"];
  const categories = Object.keys(groupedSkills).sort((a, b) => {
      return priority.indexOf(a) - priority.indexOf(b);
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 container-wide">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black font-heading tracking-tighter"
            >
                System Capabilities
            </motion.h1>
            <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="h-1 w-24 bg-primary mx-auto"
            ></motion.div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse font-mono text-sm">INITIALIZING_MODULES...</div>
        ) : (
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-16 relative"
            >
                {/* Visual Connector Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-border/50 hidden md:block"></div>

                {categories.map((category) => {
                    const Icon = CATEGORY_ICONS[category] || Code2;
                    return (
                        <motion.div key={category} variants={item} className="space-y-6 relative md:pl-20">
                            {/* Node Connector */}
                            <div className="absolute left-[27px] top-6 w-12 h-px bg-border/50 hidden md:block"></div>
                            <div className="absolute left-[27px] top-[22px] w-1.5 h-1.5 rounded-full bg-primary hidden md:block shadow-[0_0_10px_var(--color-primary)]"></div>

                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold font-mono uppercase tracking-widest text-muted-foreground/80 flex items-center gap-3">
                                    <Icon className="w-5 h-5 text-primary" /> {category}
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {groupedSkills[category].sort((a: any, b: any) => a.order - b.order).map((skill: any) => (
                                    <div 
                                        key={skill._id}
                                        className="group relative p-4 bg-card/20 border border-border/30 rounded-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                                            <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground transition-colors">{skill.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        )}
      </div>
    </main>
  );
}
