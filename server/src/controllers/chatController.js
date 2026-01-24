import ChatLog from '../models/ChatLog.js';
import ChatbotSettings from '../models/ChatbotSettings.js';
import mongoose from 'mongoose';
import { retrieveContext } from '../rag/retrieve.js';
import { buildPrompt } from '../rag/prompt.js';

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
        const retrievedDocs = await retrieveContext(message, 10); // Get top 10

        // 3. Construct Prompt with RAG
        const finalPrompt = await buildPrompt(message, retrievedDocs);

        // 4. Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: settings.model,
                messages: [
                    { role: "system", content: "You are a strict portfolio documentation assistant. Follow the user's provided context rules exactly." },
                    { role: "user", content: finalPrompt }
                ]
            })
        });

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Please try again.";

        // 5. Save Logs (Keep MongoDB for logs)
        // Log the used context IDs or content metadata if you wish. 
        // Here we just accept we used retrieval.

        // ... (Log saving logic remains)


        // 6. Save Logs
        await ChatLog.create({
            sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
            role: 'user',
            content: message,
            userId: user ? user._id : null,
            metadata: {}
        });

        await ChatLog.create({
            sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
            role: 'assistant',
            content: botReply,
            userId: user ? user._id : null,
            // contextUsed: []
        });

        res.status(200).json({
            status: 'success',
            data: {
                reply: botReply,
                // contextUsed: []
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
