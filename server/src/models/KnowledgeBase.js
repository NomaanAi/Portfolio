import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['identity', 'skills', 'projects', 'education', 'contact', 'other'],
        default: 'other',
    },
    embedding: {
        type: [Number], // Vector embedding
        required: false, // Optional for now if we use keyword fallback
    },
    tags: [String]
}, { timestamps: true });

// Simple text search index
knowledgeBaseSchema.index({ content: 'text', title: 'text', tags: 'text' });

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
