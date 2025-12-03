require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Analytics = require('./models/Analytics');
const Social = require('./models/Social');
const Homepage = require('./models/Homepage');
const connectDB = require('./config/db');

const seed = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Admin.deleteMany({});
        await Project.deleteMany({});
        await Skill.deleteMany({});
        await Analytics.deleteMany({});
        await Social.deleteMany({});
        await Homepage.deleteMany({});
        console.log('Data Cleared');

        // Create Admin
        const hashed = await bcrypt.hash('admin123', 10);
        await Admin.create({ email: 'admin@example.com', password: hashed });
        console.log('Admin Created: admin@example.com / admin123');

        // Create Projects
        await Project.create([
            {
                title: 'E-Commerce Platform',
                desc: 'A full-stack e-commerce solution with payment integration.',
                image: 'https://via.placeholder.com/600x400',
                link: 'https://github.com',
                tags: ['React', 'Node.js', 'MongoDB']
            },
            {
                title: 'Portfolio Website',
                desc: 'A modern portfolio website with admin dashboard.',
                image: 'https://via.placeholder.com/600x400',
                link: 'https://github.com',
                tags: ['React', 'Tailwind', 'Express']
            }
        ]);
        console.log('Projects Created');

        // Create Skills
        await Skill.create([
            { name: 'JavaScript', level: 'Advanced', icon: 'js' },
            { name: 'React', level: 'Advanced', icon: 'react' },
            { name: 'Node.js', level: 'Intermediate', icon: 'node' },
            { name: 'MongoDB', level: 'Intermediate', icon: 'mongo' }
        ]);
        console.log('Skills Created');

        // Create Analytics
        await Analytics.create([
            { event: 'api_request', meta: { path: '/api/projects', method: 'GET' } },
            { event: 'api_request', meta: { path: '/api/skills', method: 'GET' } },
            { event: 'project_view', meta: { projectId: '123' } }
        ]);
        console.log('Analytics Created');

        // Create Social
        await Social.create({
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
        });
        console.log('Socials Created');

        // Create Homepage
        await Homepage.create({
            heroTitle: 'Building Digital Experiences',
            heroSubtitle: 'Full Stack Developer',
            aboutText: 'I am a passionate developer building web applications.'
        });
        console.log('Homepage Created');

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
