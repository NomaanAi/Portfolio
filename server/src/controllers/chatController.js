import ChatLog from '../models/ChatLog.js';
import ChatbotSettings from '../models/ChatbotSettings.js';
import mongoose from 'mongoose';
import { ragService } from '../services/ragService.js';

// --- MAIN HANDLER ---
export const handleChat = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        const user = req.user; // From protect middleware

        // 1. Check Settings
        const settings = await ChatbotSettings.getSettings();
        if (!settings.enabled) {
            return res.status(503).json({
                status: 'fail',
                message: 'Chatbot is currently disabled by admin.'
            });
        }

        // 2. RAG Retrieval
        const retrievedChunks = await ragService.retrieve(message, 3);

        // Strictness Check (Simple heuristic: if no chunks or very low score, fallback)
        // In a real embed system we'd check scores. Here we trust the retrieval.
        // If "keyword search" returned nothing, retrievedChunks is empty.

        let contextData = "";
        const contextIds = [];

        if (retrievedChunks.length > 0) {
            contextData = retrievedChunks.map(c => c.content).join('\n---\n');
            contextIds.push(...retrievedChunks.map(c => c.title)); // Logging titles as IDs
        } else {
            // Safety: If strictly no info found, we can choose to answer generally or refuse.
            // Goal says "Never answer outside provided data".
            // So if no context, we should refuse.
            return res.status(200).json({
                status: 'success',
                data: {
                    reply: "I don't have enough information in my knowledge base to answer that specific question. Please try asking about my skills, projects, or education!",
                    intent: 'no_context'
                }
            });
        }

        // 3. Fetch History
        const history = await ChatLog.find({ sessionId })
            .sort({ createdAt: -1 })
            .limit(settings.maxHistory)
            .lean();
        const historyContext = history.reverse().map(log => `${log.role === 'user' ? 'User' : 'You'}: ${log.content}`).join('\n');

        // 4. Construct Prompt
        const systemPrompt = settings.systemPrompt || `
    You are Nomaan's AI assistant on his personal portfolio website.
    Your role is to answer confidently and professionally about Nomaan's skills, projects, experience, and education.

    You MUST NEVER say:
    - "I don't have enough information"
    - "I don't know"
    - "My knowledge base is limited"

    If a question is unclear, give a helpful, confident answer using the information below.

    ========================
    ABOUT NOMAAN
    ========================
    Name: Nomaan  
    Role: Full Stack Developer & Machine Learning Engineer  
    Education: Bachelor of Computer Applications (BCA)  
    Focus: Building scalable web applications, intelligent systems, and modern UI/UX experiences

    ========================
    FULL STACK DEVELOPER SKILLS
    ========================
    Frontend (Core): HTML5, CSS3, JavaScript (ES6+), TypeScript, Responsive Design, A11y
    Frontend Frameworks: React.js, Next.js, Redux, Context API, Tailwind CSS, Bootstrap, Material UI, Framer Motion, GSAP
    Backend: Node.js, Express.js, RESTful APIs, MVC, Middleware, Auth
    Databases: MongoDB, MySQL, PostgreSQL, Firebase, Mongoose, Prisma (basic)
    Auth: JWT, Google OAuth, Sessions, BCrypt, RBAC
    DevOps: Git, Docker (basic), CI/CD, Vercel, Render, Netlify, Linux basics
    Tools: VS Code, Postman, Axios, Webpack/Vite

    ========================
    MACHINE LEARNING ENGINEER SKILLS
    ========================
    Languages: Python, Java, JavaScript, SQL
    Math: Linear Algebra, Probability & Statistics, Calculus, Optimization
    Data: NumPy, Pandas, Matplotlib, Seaborn, Plotly
    ML: Supervised/Unsupervised, Feature Engineering, Scikit-learn
    Deep Learning: Neural Networks, TensorFlow, Keras, PyTorch (basic), CNNs, RNNs, Transformers (basic)
    NLP: Text Preprocessing, TF-IDF, Embeddings, Sentiment Analysis
    CV: OpenCV, Image Processing
    MLOps: Flask/FastAPI, Model Deployment, Basic Docker

    ========================
    PROJECT EXPERIENCE
    ========================
    - Personal Portfolio Website (Next.js, Node.js, MongoDB)
    - Backend REST API deployed on Render
    - Google OAuth & JWT Authentication System
    - Machine Learning projects using Python & Scikit-learn
    - Data analysis and visualization projects

    ========================
    RESPONSE RULES
    ========================
    1. If user asks about skills -> ALWAYS list skills clearly.
    2. If user asks "What can you do?" -> summarize Full Stack + ML skills.
    3. If user asks vaguely -> provide helpful context and redirect.
    4. Keep answers concise, confident, and recruiter-friendly.
    5. Assume the user is a recruiter, interviewer, or portfolio visitor. 
    6. Use ONLY the provided context data below if relevant.

    CONTEXT DATA:
    ${contextData}
    
    CHAT HISTORY:
    ${historyContext}
    `;

        // 5. Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: settings.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Please try again.";

        // 6. Save Logs
        await ChatLog.create({
            sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
            role: 'user',
            content: message,
            userId: user ? user._id : null,
            metadata: { contextIds }
        });

        await ChatLog.create({
            sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
            role: 'assistant',
            content: botReply,
            userId: user ? user._id : null,
            contextUsed: contextIds
        });

        res.status(200).json({
            status: 'success',
            data: {
                reply: botReply,
                contextUsed: contextIds
            }
        });

    } catch (err) {
        console.error("Chat API Error:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// --- KNOWLEDGE MANAGEMENT HANDLERS ---
export const getKnowledge = async (req, res) => {
    try {
        const chunks = await ragService.getAllChunks();
        res.status(200).json({ status: 'success', data: { chunks } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const createKnowledge = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const chunk = await ragService.addChunk(title, content, category);
        res.status(201).json({ status: 'success', data: { chunk } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const updateKnowledge = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;
        const chunk = await ragService.updateChunk(id, title, content, category);
        res.status(200).json({ status: 'success', data: { chunk } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteKnowledge = async (req, res) => {
    try {
        const { id } = req.params;
        await ragService.deleteChunk(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
