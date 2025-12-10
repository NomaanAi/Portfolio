import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/Project.model.js";

dotenv.config();

const projects = [
  {
    title: "AI Resume Analyzer",
    description: "NLP-based resume screening system with keyword extraction and scoring.",
    techStack: ["Python", "NLP", "React", "Node.js"],
    githubUrl: "https://github.com/yourname/resume-ai",
    category: "ai-ml"
  },
  {
    title: "Smart Portfolio Admin Panel",
    description: "Admin-controlled portfolio with real-time project management.",
    techStack: ["React", "Express", "MongoDB"],
    githubUrl: "https://github.com/yourname/portfolio-admin",
    liveUrl: "https://your-portfolio.vercel.app",
    category: "full-stack"
  },
  {
    title: "ML Deployment Pipeline",
    description: "End-to-end ML pipeline with model versioning and REST API inference.",
    techStack: ["FastAPI", "Docker", "MLflow"],
    category: "ai-ml"
  }
];

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  await Project.deleteMany();
  await Project.insertMany(projects);
  console.log("✅ Dummy projects inserted");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
