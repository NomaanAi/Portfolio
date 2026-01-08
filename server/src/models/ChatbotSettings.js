import mongoose from 'mongoose';

const chatbotSettingsSchema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        default: true,
    },
    systemPrompt: {
        type: String,
        default: '', // If empty, use the default generated prompt
    },
    model: {
        type: String,
        default: 'openai/gpt-3.5-turbo', // Default OpenRouter model
    },
    responseStyle: {
        type: String,
        enum: ['concise', 'detailed', 'professional', 'casual'],
        default: 'professional',
    },
    maxHistory: {
        type: Number,
        default: 10,
    }
}, { timestamps: true });

// Singleton pattern: Ensure only one settings document exists
chatbotSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.model('ChatbotSettings', chatbotSettingsSchema);
