"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Brain, Layers, Briefcase, ChevronRight } from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills");
        const data = res.data.data.data || res.data.data || [];
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const getIcon = (category: string) => {
    if (category.includes("Machine Learning")) return Brain;
    if (category.includes("Systems")) return Layers;
    return Briefcase;
  };

  // Group skills by category
  const groups = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = { items: [], description: skill.category };
    acc[skill.category].items.push(skill);
    // Use the first description found for the category if available
    if (skill.description && !acc[skill.category].description_text) {
        acc[skill.category].description_text = skill.category; 
    }
    return acc;
  }, {});

  const sortedCategories = Object.keys(groups).sort((a, b) => {
      const order = ["Machine Learning & Data Reasoning", "Systems / Backend Thinking", "Engineering Judgment"];
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
  });

  return (
    <main className="min-h-screen pt-40 pb-20 px-6 container-max">
      <div className="max-w-5xl mx-auto">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black font-heading mb-8 tracking-tighter">
              Skills
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
              A list of engineering capabilities documented through project implementation.
              Descriptions focus on how specific constraints were handled and decisions were made.
            </p>
          </motion.div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-[10px] font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
                Retrieving capability index...
            </div>
        ) : (
            <div className="space-y-32">
            {sortedCategories.map((category) => {
                const group = groups[category];
                const Icon = getIcon(category);
                return (
                    <section key={category} className="grid md:grid-cols-[300px_1fr] gap-12 lg:gap-24">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                        <Icon className="w-5 h-5" />
                        <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em]">{category}</h2>
                        </div>
                        <div className="h-px w-12 bg-border" />
                    </div>

                    <div className="grid gap-16">
                        {group.items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any, itemIdx: number) => (
                        <motion.div 
                            key={item._id}
                            initial={{ opacity: 0, x: 15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: itemIdx * 0.1 }}
                            className="group"
                        >
                            <div className="flex flex-col gap-4">
                            <span className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                                {item.name}
                            </span>
                            {item.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl italic">
                                    &quot;{item.description}&quot;
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-3 h-3 text-primary" />
                                <span>Defended by: {item.defendedBy || 'Archive Entry'}</span>
                            </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                    </section>
                );
            })}
            </div>
        )}
      </div>
    </main>
  );
}
