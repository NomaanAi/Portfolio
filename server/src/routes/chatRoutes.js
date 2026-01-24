import express from 'express';
import { handleChat, getKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/chatController.js';
import ChatbotSettings from '../models/ChatbotSettings.js';
import ChatLog from '../models/ChatLog.js';
import { protect } from '../middleware/auth.js';
import { ragService } from '../services/ragService.js';
import path from 'path';

const router = express.Router();

// Public Chat Route
router.post('/', handleChat);

// PROTECT ALL ROUTES BELOW
router.use(protect);

// Knowledge Base Management (Admin Only)
router.route('/knowledge')
    .get(getKnowledge)
    .post(createKnowledge);

router.route('/knowledge/:id')
    .put(updateKnowledge)
    .delete(deleteKnowledge);

// Admin Route to Ingest Knowledge
router.post('/ingest', async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), '../CHATBOT_SYSTEM_PROMPT.md');
        const result = await ragService.ingestSystemPrompt(filePath);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.get('/settings', async (req, res) => {
    try {
        const settings = await ChatbotSettings.getSettings();
        res.status(200).json({ status: 'success', data: { settings } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.patch('/settings', async (req, res) => {
    try {
        const settings = await ChatbotSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).json({ status: 'success', data: { settings } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const logs = await ChatLog.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ status: 'success', data: { logs } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

export default router;
