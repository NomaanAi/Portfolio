import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ["AI/ML", "Backend", "Frontend", "DevOps", "Other"] 
    },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Skill", skillSchema);
