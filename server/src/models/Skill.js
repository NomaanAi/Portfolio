import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["Machine Learning & Data Reasoning", "Systems / Backend Thinking", "Engineering Judgment", "Languages", "Tools", "Other"]
    },
    description: { type: String },
    defendedBy: { type: String }, // Project title or ID
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Skill", skillSchema);
