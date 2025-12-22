"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"]
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL", "Supabase"]
  },
  {
    title: "DevOps & Tools",
    skills: ["Docker", "AWS", "Git", "CI/CD", "Vercel", "Figma"]
  }
];

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-20 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 text-foreground">
            Technical <span className="text-accent-secondary">Arsenal.</span>
          </h1>
          <p className="text-xl text-accent-secondary max-w-2xl leading-relaxed">
            A curated list of technologies I use to build digital products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="border-t border-white/10 pt-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-8">{category.title}</h3>
              <ul className="space-y-4">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-4 text-accent-secondary hover:text-foreground transition-colors group cursor-default">
                    <span className="w-1.5 h-1.5 bg-accent-secondary rounded-full group-hover:bg-foreground transition-colors" />
                    <span className="text-lg tracking-wide">{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
