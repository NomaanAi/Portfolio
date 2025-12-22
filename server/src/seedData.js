import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Skill from './models/Skill.js';
import Project from './models/Project.model.js';
import Experience from './models/Experience.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // CLEAR EXISTING DATA
        await Skill.deleteMany({});
        await Project.deleteMany({});
        await Experience.deleteMany({});
        console.log('Cleared existing data.');

        // 1. SKILLS (Strict 4 Columns)
        const skills = [
            // AI / ML
            { name: "PyTorch", category: "AI/ML", order: 1 },
            { name: "TensorFlow", category: "AI/ML", order: 2 },
            { name: "Transformers", category: "AI/ML", order: 3 },
            { name: "RAG Pipelines", category: "AI/ML", order: 4 },
            { name: "Computer Vision", category: "AI/ML", order: 5 },
            { name: "OpenAI API", category: "AI/ML", order: 6 },

            // Backend
            { name: "Node.js", category: "Backend", order: 1 },
            { name: "Python / FastAPI", category: "Backend", order: 2 },
            { name: "PostgreSQL", category: "Backend", order: 3 },
            { name: "Redis", category: "Backend", order: 4 },
            { name: "System Design", category: "Backend", order: 5 },
            { name: "Microservices", category: "Backend", order: 6 },

            // Frontend
            { name: "React", category: "Frontend", order: 1 },
            { name: "Next.js", category: "Frontend", order: 2 },
            { name: "TypeScript", category: "Frontend", order: 3 },
            { name: "Tailwind CSS", category: "Frontend", order: 4 },
            { name: "WebGL", category: "Frontend", order: 5 },
            { name: "Performance", category: "Frontend", order: 6 },

            // DevOps
            { name: "Docker", category: "DevOps", order: 1 },
            { name: "Kubernetes", category: "DevOps", order: 2 },
            { name: "AWS / GCP", category: "DevOps", order: 3 },
            { name: "CI/CD Pipelines", category: "DevOps", order: 4 },
            { name: "Linux", category: "DevOps", order: 5 },
            { name: "Terraform", category: "DevOps", order: 6 },
        ];
        await Skill.insertMany(skills);
        console.log('Seeded Skills');

        // 2. PROJECTS (Minimal List)
        const projects = [
            {
                title: "Neural Nexus",
                desc: "Distributed system for visualizing real-time training metrics across clusters.",
                stack: ["React", "Python", "WebSocket"],
                featured: true,
                order: 1
            },
            {
                title: "Market Maker",
                desc: "Decentralized exchange protocol with automated liquidity provision.",
                stack: ["Rust", "Solana", "TypeScript"],
                featured: true,
                order: 2
            },
            {
                title: "Vision OS",
                desc: "Web-based operating system simulation with complete file system.",
                stack: ["Vite", "Wasm", "C++"],
                featured: true,
                order: 3
            }
        ];
        await Project.insertMany(projects);
        console.log('Seeded Projects');

        // 3. EXPERIENCE (Timeline)
        const experience = [
            {
                role: "Senior Engineer",
                company: "Neural Systems",
                duration: "2024 — Present",
                description: "Architecting autonomous agent frameworks and optimizing large-scale inference pipelines. Reduced model latency by 40%.",
                order: 1
            },
            {
                role: "Full Stack Dev",
                company: "TechFlow",
                duration: "2022 — 2024",
                description: "Led migration to microservices. Implemented CI/CD pipelines reducing deployment time by 60%.",
                order: 2
            },
            {
                role: "Frontend Dev",
                company: "Alpha Creative",
                duration: "2020 — 2022",
                description: "Developed high-performance 3D web experiences using React Three Fiber. Established unified design systems.",
                order: 3
            }
        ];
        await Experience.insertMany(experience);
        console.log('Seeded Experience');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
