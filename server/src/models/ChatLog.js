import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    metadata: {
        intent: String,
        tokens: Number,
        latency: Number,
    },
    ip: String,
    userAgent: String,
}, { timestamps: true });

export default mongoose.model('ChatLog', chatLogSchema);
