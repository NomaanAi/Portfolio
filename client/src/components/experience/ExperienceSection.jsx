"use client";

import { motion } from "framer-motion";

const experience = [];

export default function ExperienceSection() {
  if (experience.length === 0) {
    return null; // Don't render empty section
  }

  return (
    <section id="experience" className="py-24 relative z-10 w-full bg-zinc-950/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-16 pl-6 border-l-4 border-cyan">
          TRAJECTORY
        </h2>

        <div className="relative border-l border-white/10 ml-6 md:ml-10 space-y-12">
          {experience.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-cyan rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-0">
                  {item.role}
                </h3>
                <span className="font-mono text-sm text-cyan/80">{item.period}</span>
              </div>
              
              <h4 className="text-lg text-gray-500 mb-4 font-mono">{item.company}</h4>
              <p className="text-gray-400 leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
