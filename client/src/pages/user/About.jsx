
import { motion } from "framer-motion";
import { Code2, Brain, Database, Globe } from "lucide-react";
import SEO from "../../components/SEO";

export default function About() {
  const skills = [
    { icon: Brain, title: "AI/ML", desc: "TensorFlow, PyTorch, Scikit-learn" },
    { icon: Code2, title: "Frontend", desc: "React, Tailwind, Framer Motion" },
    { icon: Database, title: "Backend", desc: "Node.js, Express, MongoDB" },
    { icon: Globe, title: "DevOps", desc: "AWS, Docker, CI/CD" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <SEO 
        title="About | Noman.dev" 
        description="Learn more about Noman, a Full-Stack Developer and AI Engineer specializing in React, Node.js, and Machine Learning."
      />
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400">
          About Me
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          I'm a Full-Stack Developer and AI Enthusiast passionate about building intelligent systems that solve real-world problems. With a strong foundation in both web technologies and machine learning, I bridge the gap between complex algorithms and intuitive user interfaces.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        {skills.map((skill, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-accent/40 transition-colors"
          >
            <skill.icon size={32} className="text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
            <p className="text-slate-400">{skill.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-800">
        <h2 className="text-2xl font-bold mb-4">My Journey</h2>
        <div className="space-y-4 text-slate-400">
          <p>
            Started as a curious student exploring Python scripts, I quickly fell in love with the endless possibilities of software development.
          </p>
          <p>
            Over the years, I've honed my skills in building scalable web applications and deploying machine learning models. I believe in writing clean, maintainable code and constantly learning new technologies.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
