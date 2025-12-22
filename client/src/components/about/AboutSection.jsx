"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative z-10 w-full bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-12 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-cyan block" />
              ABOUT
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light font-sans mb-8">
              I Engineer Intelligence.
            </p>
            
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              As a Machine Learning Engineer, I don't just train models; I architect systems that reason, adapt, and scale. My focus lies at the intersection of <span className="text-cyan font-medium">Deep Learning</span>, <span className="text-cyan font-medium">Edge Computing</span>, and <span className="text-cyan font-medium">High-Performance Infrastructure</span>.
            </p>
            
            <p className="text-lg text-gray-400 leading-relaxed">
              I specialize in translating theoretical research into deployment-ready solutions. Whether optimizing inference latency for real-time vision or orchestrating agentic workflows for complex decision-making, my code is built for endurance and precision.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
