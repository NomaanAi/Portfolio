import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Code2, Terminal } from "lucide-react";
import DownloadCV from "./DownloadCV";

const headlines = [
  "AI-powered web systems.",
  "Full-stack deployment.",
  "Scalable architectures."
];

export default function Hero({ settings }) {
  const [index, setIndex] = useState(0);

  // Default headlines if not in settings or dynamic
  const headlines = [
    settings?.subtitle || "Full Stack Developer",
    "AI-powered web systems.",
    "Order and Chaos."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % headlines.length);
    }, 4000); // Slow 4s transition
    return () => clearInterval(timer);
  }, [headlines.length]); // depend on default headlines length

  return (
    <section className="relative min-h-[500px] flex items-center justify-start py-20 overflow-hidden rounded-3xl bg-slate-950 border border-slate-900 mt-6 mb-12">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl px-8 md:px-12">
        <div className="flex items-center gap-2 mb-6">
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500/20" />
             <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
             <div className="w-2 h-2 rounded-full bg-green-500/20" />
           </div>
           <div className="w-full h-px bg-white/5" />
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-cyan-500 text-sm tracking-widest uppercase mb-4 block">
            {settings?.subtitle || "AI/ML Engineer & Full-Stack Developer"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 leading-tight mb-6 tracking-tight h-[3.6em] md:h-[2.4em]">
            {settings?.title || "Building production-ready"} <br/>
            <AnimatePresence mode="wait">
              <motion.span 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeOut" }} // Calm fade
                className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 pb-2"
              >
                 {headlines[index]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-8">
            Specializing in scalable architecture, custom model deployment, and secure full-stack applications. Moving beyond prototypes to robust, maintainable solutions.
          </p>

          <div className="flex flex-wrap gap-4">
             <a 
               href="/projects" 
               className="group flex items-center gap-2 px-6 py-3 bg-cyan-950 text-cyan-400 font-medium rounded-lg border border-cyan-500/20 hover:bg-cyan-900/40 transition-all"
             >
               <Code2 size={18} />
               <span>View System Architecture</span>
             </a>
             
             <div className="flex items-center gap-2 px-6 py-3 text-slate-400 border border-slate-800 rounded-lg hover:text-slate-200 hover:border-slate-700 transition-all">
                <Download size={18} />
                <DownloadCV text="Download CV" className="" />
             </div>
          </div>
        </motion.div>
      </div>
      
      {/* Code Snippet Decor (Optional, subtle) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none select-none">
         <Terminal className="w-96 h-96 text-slate-800" />
      </div>
    </section>
  );
}
