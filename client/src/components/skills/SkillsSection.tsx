"use client";

import { motion } from "framer-motion";

const SKILLS = {
  "Core Stack": ["Python", "TypeScript", "C++", "SQL / NoSQL"],
  "AI & ML": ["PyTorch", "TensorFlow", "HuggingFace", "LangChain", "RAG Pipelines"],
  "Infrastructure": ["Docker", "Kubernetes", "AWS SageMaker", "FastAPI"],
  "Web Engineering": ["Next.js (App Router)", "React", "Tailwind CSS", "Three.js"]
};

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 container mx-auto px-6 md:px-20 border-t border-white/5 bg-black/20">
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-right">
             CAPABILITIES <span className="text-accent-violet">///</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {Object.entries(SKILLS).map(([category, items], index) => (
             <motion.div 
               key={category}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1, duration: 0.5 }}
               viewport={{ once: true }}
               className="group"
             >
                <h3 className="text-xl font-bold text-white mb-6 border-l-2 border-accent-cyan pl-4 group-hover:bg-accent-cyan/5 transition-colors py-2">
                   {category}
                </h3>
                <ul className="space-y-3">
                   {items.map((skill) => (
                     <li key={skill} className="text-text-secondary flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-accent-cyan transition-colors" />
                        {skill}
                     </li>
                   ))}
                </ul>
             </motion.div>
           ))}
        </div>
      </motion.div>
    </section>
  );
}
