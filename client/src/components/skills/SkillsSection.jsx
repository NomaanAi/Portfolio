"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Skills3D = dynamic(() => import("./Skills3D"), { ssr: false });

const skills = [
  {
    category: "Languages & Core",
    items: ["Python", "C++", "Rust", "TypeScript", "SQL", "CUDA"]
  },
  {
    category: "ML / DL Frameworks",
    items: ["PyTorch", "TensorFlow", "JAX", "Scikit-learn", "Hugging Face", "ONNX"]
  },
  {
    category: "Domains",
    items: ["Computer Vision", "NLP / LLMs", "Reinforcement Learning", "Time Series", "Generative AI"]
  },
  {
    category: "Infrastructure & Tools",
    items: ["Docker", "Kubernetes", "AWS / GCP", "MLflow", "Git Actions", "Linux"]
  }
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative z-10 w-full bg-zinc-950/30 overflow-hidden">
      <Skills3D />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold font-poppins mb-16 text-center"
        >
          TECHNICAL ARSENAL
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skills.map((group, idx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="glass-panel p-8 hover:border-brand-cyan/30 transition-colors duration-300"
            >
              <h3 className="text-brand-cyan font-mono text-sm tracking-wider uppercase mb-6 border-b border-white/5 pb-2">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {group.items.map((skill) => (
                  <span key={skill} className="text-gray-300 font-sans text-lg hover:text-white transition-colors cursor-default hover:text-glow">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
