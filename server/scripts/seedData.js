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

import KnowledgeBase from './models/KnowledgeBase.js';
import { ragService } from './services/ragService.js';

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // CLEAR EXISTING DATA
        await Skill.deleteMany({});
        await Project.deleteMany({});
        await Experience.deleteMany({});
        await KnowledgeBase.deleteMany({});
        console.log('Cleared existing data.');

        // 1. SKILLS 
        const skills = [
            // Frontend
            { name: "Next.js", category: "Frontend", order: 1 },
            { name: "React", category: "Frontend", order: 2 },
            { name: "Tailwind CSS", category: "Frontend", order: 3 },
            { name: "JavaScript", category: "Languages", order: 4 },
            { name: "Framer Motion", category: "Frontend", order: 5 },
            { name: "HTML5/CSS3", category: "Frontend", order: 6 },

            // Backend (Including Database)
            { name: "Node.js", category: "Backend", order: 1 },
            { name: "Express.js", category: "Backend", order: 2 },
            { name: "MongoDB", category: "Backend", order: 3 },
            { name: "Mongoose ODM", category: "Backend", order: 4 },
            { name: "REST APIs", category: "Backend", order: 5 },
            { name: "Authentication", category: "Backend", order: 6 },

            // AI/ML
            { name: "OpenRouter API", category: "AI/ML", order: 1 },
            { name: "Prompt Eng.", category: "AI/ML", order: 2 },
            { name: "Python Basics", category: "Languages", order: 3 },

            // Tools
            { name: "Git / GitHub", category: "Tools", order: 1 },
            { name: "VS Code", category: "Tools", order: 2 },
            { name: "Postman", category: "Tools", order: 3 },
        ];
        await Skill.insertMany(skills);
        console.log('Seeded Skills');

        // 2. PROJECTS (Realistic BCA Level)
        const projects = [
            {
                title: "AI Portfolio Chatbot",
                desc: "An intelligent chatbot integrated into my portfolio that answers questions about my skills and projects using OpenRouter API. Built with Next.js and custom system prompts.",
                stack: ["Next.js", "OpenRouter API", "Tailwind CSS"],
                featured: true,
                order: 1
            },
            {
                title: "Student Dashboard",
                desc: "A full-stack student management system allowing CRUD operations for student records. Features secure authentication and MongoDB database integration.",
                stack: ["MERN Stack", "Redux", "JWT"],
                featured: true,
                order: 2
            },
            {
                title: "E-Commerce Starter",
                desc: "A functional e-commerce landing page with product listing and cart functionality. Focuses on clean UI/UX and responsive design principles.",
                stack: ["React", "Context API", "CSS Modules"],
                featured: true,
                order: 3
            }
        ];
        await Project.insertMany(projects);
        console.log('Seeded Projects');

        // 3. EXPERIENCE (Student Level)
        const experience = [
            {
                role: "Freelance Developer",
                company: "Self-Employed",
                duration: "2024 — Present",
                description: "Building responsive websites for local small businesses. Improving web performance and SEO rankings.",
                order: 1
            },
            {
                role: "Web Dev Intern",
                company: "Tech Startups (Remote)",
                duration: "2023 — 2024",
                description: "Assisted in frontend development using React. Collaborated with senior developers to fix UI bugs and improve layout consistency.",
                order: 2
            },
            {
                role: "Hackathon Participant",
                company: "College Events",
                duration: "2022 — 2023",
                description: "Worked in teams to build rapid prototypes. Learned version control with Git and agile development basics.",
                order: 3
            }
        ];
        await Experience.insertMany(experience);
        console.log('Seeded Experience');

        // 4. IDENTITY (RAG Knowledge Base)
        console.log('Starting RAG Ingestion...');

        // Static Identity
        await ragService.addChunk(
            "Identity: Who is Nomaan?",
            "I am Nomaan, a driven BCA student and Full Stack Developer. I love building modern web applications, exploring AI integration, and solving real-world problems with code. I am currently open to internship opportunities.",
            "identity"
        );

        await ragService.addChunk(
            "Education",
            "I am currently pursuing my BCA (Bachelor of Computer Applications). I am in my 4th Semester.",
            "education"
        );

        // Sync Skills
        for (const skill of skills) {
            await ragService.addChunk(
                `Skill: ${skill.name}`,
                `I am proficient in ${skill.name}. It is a key part of my ${skill.category} stack.`,
                "skills"
            );
        }

        // Sync Projects
        for (const proj of projects) {
            await ragService.addChunk(
                `Project: ${proj.title}`,
                `I built ${proj.title}. ${proj.desc}. Tech stack includes: ${proj.stack.join(', ')}.`,
                "projects"
            );
        }
        console.log('Seeded RAG Knowledge Base');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
