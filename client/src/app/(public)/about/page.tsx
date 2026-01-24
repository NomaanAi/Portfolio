"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

export default function ContextPage() {
  const [content, setContent] = useState("");
  const [principles, setPrinciples] = useState<{ p: string; d: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/settings");
        const settings = res.data.data?.settings || res.data.data || {};
        if (settings.about) {
          setContent(settings.about.text || "");
          setPrinciples(settings.about.principles || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <main className="min-h-screen pt-40 pb-20 px-6 container-max relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-tighter leading-none">
              About
            </h1>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-primary mb-6">
                  Operating Principles
                </h3>
                <ul className="space-y-8">
                  {principles.map((item, idx) => (
                    <li key={idx}>
                      <p className="text-sm font-bold text-foreground mb-1">
                        {item.p}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {item.d}
                      </p>
                    </li>
                  ))}
                  {principles.length === 0 && !loading && (
                    <p className="text-xs text-muted-foreground italic">No principles defined.</p>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div className="h-px w-full bg-border" />
            {loading ? (
              <div className="text-[10px] font-mono text-muted-foreground animate-pulse uppercase tracking-[0.2em]">
                Loading system context...
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {content || "System context logic not yet defined."}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
