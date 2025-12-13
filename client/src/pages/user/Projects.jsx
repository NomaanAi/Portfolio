
import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import ProjectCard from "../../components/ProjectCard";
import SEO from "../../components/SEO";



const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/projects")
      .then((res) => setProjects(res.data.data.projects))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <SEO 
        title="Projects | Noman.dev" 
        description="View my latest projects."
      />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-12"
      >
        <h1 className="text-4xl font-bold">My Projects</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A collection of my recent work, side projects, and open source contributions.
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-400">No projects found.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((p) => (
            <motion.div key={p._id || p.id} variants={item}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
