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
    You are Nomaan, a BCA student and Full Stack Developer. 
    User is visiting your portfolio.
    
    RULES:
    - Answer in first person ("I", "My").
    - Use ONLY the provided context data.
    - If answer is not in context, say "I haven't added that to my portfolio yet."
    - Be professional, humble, and concise.
    - Do NOT mention "AI", "System", or "Database".
    
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
