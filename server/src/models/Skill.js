
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true }, // Name of the Lucide icon
    level: { type: Number, default: 0 }, // 0-100 or 1-5
    category: { type: String, enum: ["Frontend", "Backend", "AI/ML", "Infra", "Other"], default: "Other" },
    linkedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
});

export default mongoose.model("Skill", skillSchema);
